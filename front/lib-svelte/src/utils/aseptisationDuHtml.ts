import DOMPurify from 'dompurify';

export const aseptiseHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'b', 'br', 'em', 'i', 'li', 'ol', 'p', 'strong', 'ul'],
  });
