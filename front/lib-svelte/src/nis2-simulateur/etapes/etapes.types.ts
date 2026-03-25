export type OuiNonNsp = 'oui' | 'non' | 'nsp';

export const optionsOuiNonNsp: Array<{
  label: string;
  name: string;
  id: string;
  value: OuiNonNsp;
}> = [
  { label: 'Oui', name: 'radios', id: 'radio-oui', value: 'oui' },
  { label: 'Non', name: 'radios', id: 'radio-non', value: 'non' },
  { label: 'Ne sais pas', name: 'radios', id: 'radio-nsp', value: 'nsp' },
];
