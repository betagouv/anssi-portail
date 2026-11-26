import { AdaptateurHorloge } from '@infra/adaptateurHorloge.js';

export type CréneauDeRappel = { début: number; fin: number };

export class RappelAnnuel {
  constructor(
    readonly titre: string,
    readonly description: string,
    readonly descriptionAlarme: string
  ) {}

  créneau(adaptateurHorloge: AdaptateurHorloge): CréneauDeRappel {
    const dansUnAn = adaptateurHorloge.maintenantZoné().add({ years: 1 });
    return {
      début: dansUnAn.with({ hour: 9, minute: 0, second: 0 }).epochMilliseconds,
      fin: dansUnAn.with({ hour: 9, minute: 30, second: 0 }).epochMilliseconds,
    };
  }
}

class ConstructeurRappelAnnuel {
  private titre?: string;
  private description?: string;
  private descriptionAlarme?: string;

  avecTitre(titre: string): this {
    this.titre = titre;
    return this;
  }

  avecDescription(...paragraphes: string[]): this {
    this.description = paragraphes.join('\n\n');
    return this;
  }

  avecDescriptionAlarme(descriptionAlarme: string): this {
    this.descriptionAlarme = descriptionAlarme;
    return this;
  }

  construis(): RappelAnnuel {
    if (this.titre === undefined) throw new Error('Le titre du rappel est obligatoire.');
    if (this.description === undefined) throw new Error('La description du rappel est obligatoire.');
    if (this.descriptionAlarme === undefined) throw new Error("La description de l'alarme du rappel est obligatoire.");

    return new RappelAnnuel(this.titre, this.description, this.descriptionAlarme);
  }
}

export const unRappelAnnuel = () => new ConstructeurRappelAnnuel();
