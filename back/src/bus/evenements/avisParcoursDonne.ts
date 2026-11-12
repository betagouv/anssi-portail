import { AvisParcours } from '../../metier/avisParcours.js';

export class AvisParcoursDonné {
  typeDeRetour: AvisParcours['typeDeRetour'];
  niveauDUtilité: AvisParcours['niveauDUtilité'];
  recommandationAutreOrganisation?: AvisParcours['recommandationAutreOrganisation'];
  commentaireAmélioration: AvisParcours['commentaireAmélioration'];
  souhaiteÊtreRecontacté: AvisParcours['souhaiteÊtreRecontacté'];
  parcours: AvisParcours['parcours'];
  emailDeContact: AvisParcours['emailDeContact'] | undefined;
  pageSource?: AvisParcours['pageSource'];

  constructor({
    typeDeRetour,
    niveauDUtilité,
    recommandationAutreOrganisation,
    commentaireAmélioration,
    souhaiteÊtreRecontacté,
    parcours,
    emailDeContact,
    pageSource,
  }: AvisParcours) {
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
