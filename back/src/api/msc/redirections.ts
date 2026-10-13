import { HttpStatusCode } from '@anssi-portail/axios';
import { Express, NextFunction, Request, Response } from 'express';

export const configureLesRedirections = (app: Express) => {
  [
    ['/aPropos', '/a-propos'],
    ['/directive-nis2', '/nis2'],
    ['/guides', '/catalogue'],
    ['/mentionsLegales', '/mentions-legales'],
    ['/guides/la-defense-en-profondeur-appliquee-aux-systemes-dinformation', '/guides/essentiels-defense-profondeur'],
    ['/services/mon-espace-nis2.html', '/nis2'],
    ['/ressources/cyber-enjeux.html', '/ressources/cyber-enjeux'],
    ['/ressources/cyber-enjeux-pro.html', '/ressources/cyber-enjeux-pro'],
    ['/ressources/reflexes-cyber.html', '/ressources/reflexes-cyber'],
    ['/ressources/secnumedu.html', '/ressources/secnumedu'],
    ['/services/ads.html', '/services/ads'],
    ['/services/conseil-technique.html', '/services/conseil-technique'],
    ['/services/demainspecialistecyber.html', '/services/demainspecialistecyber'],
    ['/services/mon-aide-cyber.html', '/services/mon-aide-cyber'],
    ['/services/mon-aide-cyber-aidants.html', '/services/mon-aide-cyber-aidants'],
    ['/services/mon-service-securise.html', '/services/mon-service-securise'],
    ['/services/mooc-ebios-rm.html', '/services/mooc-ebios-rm'],
    ['/services/secnum-academie.html', '/services/secnum-academie'],
    ['/services/silene.html', '/services/silene'],
    ['/contacts/fr-20r.html', '/contacts/fr-20r'],
    ['/contacts/fr-971.html', '/contacts/fr-971'],
    ['/contacts/fr-972.html', '/contacts/fr-972'],
    ['/contacts/fr-973.html', '/contacts/fr-973'],
    ['/contacts/fr-974.html', '/contacts/fr-974'],
    ['/contacts/fr-976.html', '/contacts/fr-976'],
    ['/contacts/fr-ara.html', '/contacts/fr-ara'],
    ['/contacts/fr-bfc.html', '/contacts/fr-bfc'],
    ['/contacts/fr-bl.html', '/contacts/fr-bl'],
    ['/contacts/fr-bre.html', '/contacts/fr-bre'],
    ['/contacts/fr-cp.html', '/contacts/fr-cp'],
    ['/contacts/fr-cvl.html', '/contacts/fr-cvl'],
    ['/contacts/fr-ges.html', '/contacts/fr-ges'],
    ['/contacts/fr-hdf.html', '/contacts/fr-hdf'],
    ['/contacts/fr-idf.html', '/contacts/fr-idf'],
    ['/contacts/fr-mf.html', '/contacts/fr-mf'],
    ['/contacts/fr-naq.html', '/contacts/fr-naq'],
    ['/contacts/fr-nc.html', '/contacts/fr-nc'],
    ['/contacts/fr-nor.html', '/contacts/fr-nor'],
    ['/contacts/fr-occ.html', '/contacts/fr-occ'],
    ['/contacts/fr-pac.html', '/contacts/fr-pac'],
    ['/contacts/fr-pdl.html', '/contacts/fr-pdl'],
    ['/contacts/fr-pf.html', '/contacts/fr-pf'],
    ['/contacts/fr-pm.html', '/contacts/fr-pm'],
    ['/contacts/fr-tf.html', '/contacts/fr-tf'],
    ['/contacts/fr-wf.html', '/contacts/fr-wf'],
    ['/promouvoir-messervicescyber', '/'],
    ['/promouvoir-diagnostic-cyber', '/'],
    ['/parcours-debuter', '/parcours-cyberdepart'],
    ['/parcours-approfondir', '/parcours-securisation-complet'],
  ].forEach(([precedent, nouveau]: string[]) => {
    app.use(precedent, (requete: Request, reponse: Response, suite: NextFunction) => {
      if (requete.originalUrl === precedent || requete.originalUrl === `${precedent}/`) {
        return reponse.redirect(HttpStatusCode.MovedPermanently, nouveau);
      }
      suite();
    });
  });
};
