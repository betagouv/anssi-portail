export {};

type CustomData = { [key in `dimension${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`]?: string };

declare global {
  interface Window {
    _paq: { push: (tab: Array<string | CustomData>) => void };
  }
}
