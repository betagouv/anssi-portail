import type { Attachment } from 'svelte/attachments';

export const quiScroll: Attachment = (element) => {
  requestAnimationFrame(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  });
};
