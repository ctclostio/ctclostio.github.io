import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Page } from './main';

export function render(pathname: string) {
  return renderToString(createElement(Page, { pathname }));
}
