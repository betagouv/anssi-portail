import type { Attachment } from 'svelte/attachments';
import { tick } from 'svelte';

export const quiScroll: Attachment = (element) => {
  tick().then(() =>
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  );
};
