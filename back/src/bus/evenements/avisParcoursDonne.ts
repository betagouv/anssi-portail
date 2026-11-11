import { TypeDeRetour } from '../../metier/messagerieInstantanee.js';
import { NiveauDUtilité } from '../../metier/niveauDeSatisfaction.js';
import { Parcours } from '../../metier/parcours.js';

export class AvisParcoursDonné {
  typeDeRetour: TypeDeRetour;
  niveauDUtilité: NiveauDUtilité;
  recommandationAutreOrganisation?: 'oui' | 'non' | 'peut-être';
  commentaireAmélioration: string;
  souhaiteÊtreRecontacté: boolean;
  parcours: Parcours;
  emailDeContact: string | undefined;
  pageSource?: string;

  constructor({
    typeDeRetour,
    niveauDUtilité,
    recommandationAutreOrganisation,
    commentaireAmélioration,
    souhaiteÊtreRecontacté,
    parcours,
    emailDeContact,
    pageSource,
  }: {
    typeDeRetour: TypeDeRetour;
    niveauDUtilité: NiveauDUtilité;
    recommandationAutreOrganisation?: 'oui' | 'non' | 'peut-être';
    commentaireAmélioration: string;
    souhaiteÊtreRecontacté: boolean;
    parcours: Parcours;
    emailDeContact: string | undefined;
    pageSource?: string;
  }) {
    this.typeDeRetour = typeDeRetour;
    this.niveauDUtilité = niveauDUtilité;
    this.recommandationAutreOrganisation = recommandationAutreOrganisation;
    this.commentaireAmélioration = commentaireAmélioration;
    this.souhaiteÊtreRecontacté = souhaiteÊtreRecontacté;
    this.parcours = parcours;
    this.emailDeContact = emailDeContact;
    this.pageSource = pageSource;
  }
}
