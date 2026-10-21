import { Outil } from '../../metier/outils/outils.js';

export class OutilTéléchargé {
  constructor(
    readonly email: string,
    readonly outil: Outil
  ) {}
}
