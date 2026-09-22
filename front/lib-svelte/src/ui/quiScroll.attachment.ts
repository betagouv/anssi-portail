import { tick } from 'svelte';
import type { Attachment } from 'svelte/attachments';

export const quiScroll: Attachment = (element) => {
  tick().then(() =>
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  );
};
