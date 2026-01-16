import DOMPurify from 'isomorphic-dompurify';

export const aseptiseHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a',
      'b',
      'br',
      'em',
      'h2',
      'h3',
      'h4',
      'h5',
      'i',
      'li',
      'ol',
      'p',
      'strong',
      'sup',
      'u',
      'ul',
    ],
  });
