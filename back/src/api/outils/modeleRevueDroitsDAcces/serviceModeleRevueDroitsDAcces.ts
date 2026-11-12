import { AdaptateurHorloge } from '../../../infra/adaptateurHorloge.js';
import { FournisseurChemin } from '../../fournisseurChemin.js';
import { ServiceModèleXslx } from '../modeleXslxGenerique/serviceModeleXslx.js';
import { ServiceÉditionXLSX } from '../serviceEditionXLSX.js';

export class ServiceModèleRevueDroitsDAccès implements ServiceModèleXslx {
  constructor(
    private readonly fournisseurChemin: FournisseurChemin,
    private readonly adaptateurHorloge: AdaptateurHorloge
  ) {}

  async génèreModèle(): Promise<Buffer> {
    const éditeurDeDocument = await new ServiceÉditionXLSX(this.adaptateurHorloge).chargeDocument(
      this.fournisseurChemin.back.modèleRevueDroitsDAccès
    );
    éditeurDeDocument.chargeLaFeuilleÀLaPosition(0).définisLibelléÀLaVersionDuJour();

    return éditeurDeDocument.versBuffer();
  }
}
