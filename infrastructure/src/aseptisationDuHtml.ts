import DOMPurify from 'isomorphic-dompurify';

export const aseptiseHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a',
      'b',
      'br',
      'div',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'i',
      'img',
      'li',
      'ol',
      'p',
      'section',
      'source',
      'strong',
      'sup',
      'track',
      'u',
      'ul',
      'video',
    ],
  });
