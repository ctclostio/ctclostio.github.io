---
title: "Fixing the small promises in PDF Splitter"
date: "2026-09-09"
description: "Keeping output files, escaping an oversized-page loop, and making PDF optimization change the document it saves."
project: "pdf-splitter"
tags: [python, pdf, testing, maintenance]
draft: false
---
PDF Splitter has a modest job: take a large PDF, break it into manageable pieces, and optionally compress them. That makes its small promises especially important. Every page should survive. An output directory should mean the directory you asked for. Choosing no compression should leave you with PDFs.

A review of the project found several places where those promises fell apart. This maintenance pass fixes them, brings the documentation up to date, and adds regression tests that open the resulting files and check their contents.

## The files that disappeared after success

The most direct bug was in cleanup. The program wrote PDF chunks, ran its compression step, then removed the intermediate PDFs.

That works when the final result is a ZIP or a 7-Zip archive. With `--method none`, the PDF itself is the final result. Cleanup deleted it anyway, leaving a success message and no output PDFs.

The shared compression path now records the final output paths. Cleanup only removes chunk PDFs that are absent from that set, and it runs after every compression job succeeds. Uncompressed PDFs stay where they belong. If compression fails, the intermediate PDFs remain available.

The desktop interface and CLI use this same processing path, so they get the same fix.

## When the closest chunk had zero pages

The splitter estimates each page's size and groups consecutive pages around a target. When adding another page crosses the target, it compares the size with and without that page.

There was a nasty boundary case. Suppose the target is 1 MB and the next page is 3 MB. A zero-page chunk appears closer to the target than a 3 MB chunk. The old calculation could select that empty chunk, leave the page cursor in the same position, and repeat indefinitely.

The corrected loop always includes at least one page before advancing. An oversized page is kept, even when it cannot fit the requested size. Tests exercise large pages at the beginning, middle, and end of a document and verify that no pages disappear or repeat.

This also needed a clearer explanation in the README: the target is approximate. PDFs share fonts and images across pages, so adding up isolated page sizes does not predict the final file size exactly. The tool now reports actual sizes for written chunks and labels preview sizes as estimates. A strict upload limit still calls for checking the finished files.

## Making the command line match its examples

The help text showed a merge command with two input files, but the argument parser only accepted one. The split path also ignored `--output`.

Both now work as advertised:

```bash
python pdf_splitter.py first.pdf second.pdf --merge -o merged.pdf
python pdf_splitter.py document.pdf -s 5 --method none -o output
```

Merge order follows the supplied input order. Split output goes into the requested directory, including nested directories. Invalid chunk sizes are rejected, and a merge cannot overwrite one of its own inputs.

The preview path received attention too. Combining optimization with `--dry-run` previously reached code that wrote files before the preview check. Optimization now uses an in-memory PDF, so a preview creates neither output files nor directories. It also avoids a temporary filename beside the source that could collide with an existing document.

## Optimization has to reach the saved PDF

The optimizer could calculate recompressed image bytes and increment a counter without inserting those bytes into the document it wrote. Some metadata changes were also applied to a different writer from the one saved.

The replacement uses a single cloned PDF writer. Image replacements, content-stream compression, and document metadata removal all happen on that writer before saving. Image replacement follows [pypdf's documented approach](https://pypdf.readthedocs.io/en/stable/user/file-size.html#reducing-image-quality).

There are deliberate limits. Shared images are processed once. Images with transparency or masks, along with inline images, are left unchanged. If recompression would make an image larger, its original object is restored. The quality presets change JPEG quality while preserving pixel dimensions; the old assumed-DPI resizing logic is gone.

The tests reopen the optimized PDF and compare its embedded image data with the source. They also check text, page count, bookmarks, metadata settings, and transparency. A smaller number in a progress message would not prove those things.

## A repeatable check for the next change

The project now has 25 regression tests. They cover the bugs above, saved page order, failures during compression, and round trips through every installed compression method. The GUI processing and cancellation paths are tested with mocked dialogs; those checks do not replace a manual visual review of the windows.

Run them with:

```bash
python -m pip install -r requirements-dev.txt
python -m unittest discover -s tests -v
```

The suite passes locally on Windows with Python 3.14. A GitHub Actions workflow adds Windows and Linux checks on Python 3.10 and 3.14. Pillow is included for image optimization, and the development requirements include ReportLab for generated fixtures and larger manual test documents.

Removing the duplicate `main()` and the unused optimization implementation also leaves a smaller program to maintain. The README now covers the CLI, merging, all compression choices, optimization limits, and testing.

The useful lesson from this pass is very concrete: inspect what remains on disk after the success message. For a file utility, that is where the promise is kept.

[Browse PDF Splitter and its tests on GitHub](https://github.com/ctclostio/pdf-splitter).
