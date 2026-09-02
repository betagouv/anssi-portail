// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { clic } from '../../src/directives/actions.svelte';

describe("L'action clic", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('transmet un clic de souris', () => {
    const element = document.createElement('button');
    const gestionnaire = vi.fn();
    const action = clic(element, gestionnaire);

    element.dispatchEvent(new MouseEvent('click', { detail: 1 }));

    expect(gestionnaire).toHaveBeenCalledOnce();
    expect(gestionnaire).toHaveBeenCalledWith(expect.any(MouseEvent));
    action?.destroy?.();
  });

  it.each(['Enter', ' '])("ne transmet qu'une fois une activation avec %s", (touche) => {
    const element = document.createElement('button');
    const gestionnaire = vi.fn();
    const action = clic(element, gestionnaire);

    const appui = new KeyboardEvent('keydown', { key: touche, cancelable: true });
    element.dispatchEvent(appui);

    expect(element.hasAttribute('data-actif-au-clavier')).toBe(true);

    element.dispatchEvent(new KeyboardEvent('keyup', { key: touche }));
    element.dispatchEvent(new MouseEvent('click', { detail: 0 }));

    expect(gestionnaire).toHaveBeenCalledOnce();
    expect(gestionnaire).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    expect(appui.defaultPrevented).toBe(false);
    expect(element.hasAttribute('data-actif-au-clavier')).toBe(false);
    action?.destroy?.();
  });

  it('ignore les autres touches', () => {
    const element = document.createElement('button');
    const gestionnaire = vi.fn();
    const action = clic(element, gestionnaire);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(gestionnaire).not.toHaveBeenCalled();
    action?.destroy?.();
  });

  it('ignore les répétitions clavier', () => {
    const element = document.createElement('button');
    const gestionnaire = vi.fn();
    const action = clic(element, gestionnaire);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', repeat: false }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', repeat: true }));
    element.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
    element.dispatchEvent(new MouseEvent('click', { detail: 0 }));

    expect(gestionnaire).toHaveBeenCalledOnce();
    action?.destroy?.();
  });

  it('transmet un clic sans activation clavier préalable', () => {
    const element = document.createElement('button');
    const gestionnaire = vi.fn();
    const action = clic(element, gestionnaire);

    element.dispatchEvent(new MouseEvent('click', { detail: 0 }));

    expect(gestionnaire).toHaveBeenCalledOnce();
    action?.destroy?.();
  });

  it("transmet un clic clavier après la fin d'une activation précédente", () => {
    vi.useFakeTimers();
    const element = document.createElement('button');
    const gestionnaire = vi.fn();
    const action = clic(element, gestionnaire);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    vi.runAllTimers();
    element.dispatchEvent(new MouseEvent('click', { detail: 0 }));

    expect(gestionnaire).toHaveBeenCalledTimes(2);
    action?.destroy?.();
  });

  it('utilise le gestionnaire mis à jour', () => {
    const element = document.createElement('button');
    const ancienGestionnaire = vi.fn();
    const nouveauGestionnaire = vi.fn();
    const action = clic(element, ancienGestionnaire);

    action?.update?.(nouveauGestionnaire);
    element.dispatchEvent(new MouseEvent('click', { detail: 1 }));

    expect(ancienGestionnaire).not.toHaveBeenCalled();
    expect(nouveauGestionnaire).toHaveBeenCalledOnce();
    action?.destroy?.();
  });

  it('retire les écouteurs à la destruction', () => {
    const element = document.createElement('button');
    const gestionnaire = vi.fn();
    const action = clic(element, gestionnaire);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    action?.destroy?.();
    element.dispatchEvent(new MouseEvent('click', { detail: 1 }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(gestionnaire).toHaveBeenCalledOnce();
    expect(element.hasAttribute('data-actif-au-clavier')).toBe(false);
  });
});
