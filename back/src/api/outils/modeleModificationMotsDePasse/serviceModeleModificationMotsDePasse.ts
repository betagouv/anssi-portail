import { AdaptateurHorloge } from '../../../infra/adaptateurHorloge.js';
import { FournisseurChemin } from '../../fournisseurChemin.js';
import { ServiceÉditionXLSX } from '../serviceEditionXLSX.js';

export class ServiceModèleModificationMotsDePasse {
  constructor(
    private readonly fournisseurChemin: FournisseurChemin,
    private readonly adaptateurHorloge: AdaptateurHorloge
  ) {}

  async génèreModèle(): Promise<Buffer> {
    const éditeurDeDocument = await new ServiceÉditionXLSX(this.adaptateurHorloge).chargeDocument(
      this.fournisseurChemin.back.modèleModificationsMotsDePasse
    );
    éditeurDeDocument.chargeLaFeuilleÀLaPosition(0).définisLibelléÀLaVersionDuJour();

    return éditeurDeDocument.versBuffer();
  }
}
