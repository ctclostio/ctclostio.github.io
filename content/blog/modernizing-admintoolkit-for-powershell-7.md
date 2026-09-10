---
title: "Modernizing AdminToolkit for PowerShell 7"
date: "2026-09-10"
description: "Fixing temp cleanup and audio-driver selection while adding reusable diagnostics, clearer failure handling, and PowerShell 7 support."
project: "AdminToolkit"
tags: [powershell, windows, maintenance, testing]
draft: false
---
AdminToolkit's temp cleanup could delete a fresh file because its containing folder was old. Its audio-driver search could include a Realtek network driver. I fixed both while moving the project to PowerShell 7.

[AdminToolkit](https://github.com/ctclostio/AdminToolkit) puts common Windows repair and administration tasks behind a console menu: system diagnostics, driver inventory, Windows Update, disk cleanup, network resets, and service maintenance. The old implementation kept everything in one Windows PowerShell script.

Version 2 keeps those menus and moves the implementation into a module, with a smaller entry script handling startup and elevation. It requires 64-bit PowerShell 7.4 or newer. The launcher now finds PowerShell 7, and an elevated relaunch preserves the arguments and uses the same PowerShell installation.

These changes are in my local working tree. I have not pushed them to the AdminToolkit repository yet, so the linked source still contains the earlier implementation.

## An old folder can contain a new file

The cleanup function selected entries older than seven days, then recursively removed them. An entry could be a file or a directory. Once an old directory passed that age check, everything beneath it was eligible for deletion, regardless of the children's timestamps.

That is a poor interpretation of "files older than seven days."

I changed cleanup to inspect individual files. It walks the configured user and Windows temp folders, selects expired files, and checks their age again before deleting them. It preserves directories and skips files it cannot remove. The result reports counts of removed and skipped files, plus the bytes removed.

Path checks matter here too. A Windows junction can make a directory lead somewhere else. Cleanup skips these links and checks the ancestors of a candidate path, so a normal-looking file beneath a junction does not slip through. It also rejects paths outside the configured temp roots.

The regression test creates an old directory containing an expired file and a fresh file. After cleanup, the expired file is gone, the fresh file remains, and the directory still exists. A separate test checks that a junction's target remains untouched.

## Realtek is not a device class

The audio inventory used a broad name match that included vendor names such as Realtek. That could bring an Ethernet driver into the list of audio packages offered for removal.

The filter now uses the media device class or an explicit audio/sound match in the device name. A test supplies both a Realtek network adapter and a Realtek audio device and checks that only the audio package appears.

I also removed the forced-deletion flag from the driver-removal command. Packages still in use should not be forced out by this menu. If a requested driver backup fails, the native-command error now stops the workflow before removal can continue.

## A successful request needs a result check

The restore-point command was a direct compatibility problem. Microsoft lists `Checkpoint-Computer` among the [cmdlets removed from PowerShell 7](https://learn.microsoft.com/powershell/scripting/whats-new/differences-from-windows-powershell).

The replacement calls Windows' System Restore provider using PowerShell's CIM management cmdlets. That exposed another detail: a successful API return does not necessarily mean Windows created a restore point.

Microsoft documents that [`CreateRestorePoint` can return success while skipping creation](https://learn.microsoft.com/windows/win32/sr/createrestorepoint-systemrestore) because a recent restore point already satisfies its frequency policy. The new code checks the method's return value, then queries for the point it requested. If it cannot find that point, it says so. It leaves the frequency policy alone.

Native commands needed the same attention to outcomes. The old repair workflow ran DISM and then System File Checker even when DISM failed. DISM repairs the Windows component image; SFC checks protected system files. Their order is useful only if the first step leaves the machine ready for the second.

The shared command runner now checks exit codes and records failures. A failed DISM command stops the sequence. A result requiring a reboot also stops before SFC. Interactive errors return control to the menu instead of ending the entire session.

The Windows Update cache reset now restores previously running services in a `finally` block. If renaming a cache fails, service recovery still runs. A failure to restart one service does not prevent attempts to restart the others.

## Diagnostics without a maintenance session

The module makes inventory available without opening the menu:

```powershell
Import-Module .\AdminToolkit\AdminToolkit.psd1

Get-ToolkitSummary
Get-ToolkitPreflight | Where-Object { -not $_.Available }
Export-ToolkitDiagnostics -OutputDirectory C:\Support\Reports
```

The diagnostics export writes text and JSON from the same collected data. Each section has a status and an error field. An unavailable BitLocker provider, for example, should leave an explanation beside the other collected information. It should not discard the whole report or silently look like an empty result.

The command-line entry point also supports JSON output without elevation prompts. For diagnostics, that output contains the report paths and a `HasErrors` flag; the detailed data lives in the saved JSON report.

For browsing, there is an explicit read-only mode:

```powershell
pwsh -NoProfile -File .\AdminToolkit.ps1 -ReadOnly
```

This blocks the toolkit's maintenance calls even when the process is elevated. Reports, inventory, and Windows console shortcuts remain available; tools opened through shortcuts retain their own controls.

`-WhatIf` previews maintenance actions. It still writes session logs and requested reports, and update scans can still contact the configured update service. Those boundaries are documented rather than hidden behind the word "preview."

## The live check found a service the tests did not

A live diagnostics run on PowerShell 7.4 failed in the services section. The code enumerated services and filtered the results afterward. An unrelated protected service, `IsolationSession`, caused an access error during enumeration.

The toolkit did not need that service. I changed the query to request only the relevant service names through CIM, filtering at the provider. The next live run collected all ten diagnostics sections successfully. There is now a regression test for that query boundary.

The finished suite has 41 tests, passing locally on PowerShell 7.4.20 and 7.6.5. Parser checks, module-manifest validation, and PSScriptAnalyzer also pass. The batch launcher passed a smoke check. I added a GitHub Actions workflow for the 7.4 baseline and the Windows runner's current PowerShell; that workflow has not been verified by a remote run yet.

The tests use isolated folders for cleanup and mocks for system changes. They check failure handling, driver selection, update prerequisites, service recovery, and preview behavior. They do not establish that a real driver removal, firmware update, or Windows repair succeeds on a particular machine.

The next check belongs on a disposable Windows machine: exercise elevation, run the maintenance operations, and inspect the resulting services, driver store, and logs.
