export {};

type CustomData = { [key in `dimension${1 | 2 | 3}`]?: string };

declare global {
  interface Window {
    _paq: { push: (tab: Array<string | CustomData>) => void };
  }
}
