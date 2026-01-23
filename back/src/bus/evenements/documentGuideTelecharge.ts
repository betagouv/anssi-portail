const originesConnues = ['msc', 'mqc'] as const;
type Origines = (typeof originesConnues)[number];
const estUneOrigineConnue = (
  origine: string | undefined
): origine is Origines => {
  return originesConnues.some((o) => o === origine);
};

export class DocumentGuideTelecharge {
  readonly nomFichier: string;
  readonly origine: Origines | undefined;

  constructor({
    nomFichier,
    origine,
  }: {
    nomFichier: string;
    origine: string | undefined;
  }) {
    this.nomFichier = nomFichier;
    this.origine = estUneOrigineConnue(origine) ? origine : undefined;
  }
}
