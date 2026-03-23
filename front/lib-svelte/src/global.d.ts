export {};

declare global {
  interface Window {
    _paq: { push: (tab: string[]) => void };
  }
}
