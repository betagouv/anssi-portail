import { calculeCodeSecteurContact } from '@anssi-portail/contacts-sectoriels';
import type { Profil } from '../stores/profil.store';

export const creeLienContactsUtiles = (profil: Profil | undefined) => {
  if (profil) {
    const codeSecteurContact = calculeCodeSecteurContact(profil.codeActivite);
    const parametres = new URLSearchParams();
    if (profil?.codeRegion) parametres.set('region', profil?.codeRegion);
    if (codeSecteurContact) parametres.set('secteur', codeSecteurContact);
    return `/contacts/#?${parametres.toString()}`;
  } else {
    return '/contacts';
  }
};
