import DOMPurify from 'dompurify';

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
      'msc-lien',
    ],
    ADD_ATTR: (nomAttribut: string, nomElement: string) =>
      nomElement === 'msc-lien' && ['blank', 'libelle', 'neutre'].includes(nomAttribut),
  });

export function decodeEntiteHtml(inputStr: string) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = inputStr;
  return textarea.value;
}
