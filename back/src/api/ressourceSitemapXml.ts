import { Request, Response, Router } from 'express';
import fs, { writeFileSync } from 'fs';
import * as path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { ConfigurationServeur } from './configurationServeur';
import { siteFront } from './fournisseurChemin';
import { corpsVide, valideCorpsRequete } from './zod';

interface LienSitemap {
  url: string;
  modifieLe?: Date | undefined;
}

const recupereLiens = (pages: string[], { fournisseurChemin }: ConfigurationServeur): LienSitemap[] => {
  return pages.map((route): LienSitemap => {
    const nomFichier = route === '/' ? 'index.html' : path.join(`${route.replace(/^\//, '')}`, 'index.html');
    const cheminFichier = fournisseurChemin.ressourceDeBase(nomFichier);
    const stats = fs.statSync(cheminFichier);
    return {
      url: `/${route}`,
      modifieLe: stats.mtime,
    };
  });
};

export const ressourceSitemapXml = (pagesStatiques: string[], configurationServeur: ConfigurationServeur) => {
  const cheminVersSitemapXml = configurationServeur.fournisseurChemin.sitemapXml();
  if (cheminVersSitemapXml.length === 0) return () => {};
  try {
    const sitemapStream = new SitemapStream({ hostname: 'https://messervices.cyber.gouv.fr' });

    const liensStatiques = recupereLiens(pagesStatiques, configurationServeur);
    liensStatiques.forEach((lien) => {
      sitemapStream.write({
        url: lien.url,
        lastmod: lien.modifieLe?.toISOString(),
      });
    });

    construitRoutesDynamiques(configurationServeur).then((liensDynamiques) => {
      liensDynamiques.forEach((lien: LienSitemap) => {
        sitemapStream.write({
          url: lien.url,
          lastmod: lien.modifieLe?.toISOString(),
        });
      });

      sitemapStream.end();

      streamToPromise(sitemapStream)
        .then((data) => {
          writeFileSync(cheminVersSitemapXml, data.toString());
          console.log(`Sitemap généré : ${cheminVersSitemapXml}`);
        })
        .catch((err) => {
          console.error('Erreur lors de la génération :', err);
        });
    });
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap :', error);
  }

  const routeur = Router();
  routeur.get('', valideCorpsRequete(corpsVide), (_requete: Request, reponse: Response) => {
    reponse.type('application/xml');
    reponse.sendFile(cheminVersSitemapXml);
  });
  return routeur;
};

const construitRoutesDynamiques = async ({
  entrepotFinancement,
  entrepotGuide,
}: ConfigurationServeur): Promise<LienSitemap[]> => {
  const liensFinancement = (await entrepotFinancement.tous()).map((financement) => ({
    url: `/financement/${financement.id}`,
  }));

  const liensGuides = (await entrepotGuide.tous()).map((guide) => ({
    url: `/guides/${guide.id}`,
    modifieLe: guide.dateMiseAJour,
  }));

  const liensRessources = siteFront
    .fichiers()
    .filter((f) => f.indexOf('front/_site/ressources') >= 0)
    .filter((f) => f.indexOf('.html') >= 0)
    .map((f) => ({ url: `/ressources/${f.split('/').pop()}`, modifieLe: fs.statSync(f).mtime }));

  const liensServices = siteFront
    .fichiers()
    .filter((f) => f.indexOf('front/_site/services') >= 0)
    .filter((f) => f.indexOf('.html') >= 0)
    .filter((f) => f.indexOf('index.html') < 0)
    .map((f) => ({ url: `/services/${f.split('/').pop()}`, modifieLe: fs.statSync(f).mtime }));

  return [...liensFinancement, ...liensGuides, ...liensRessources, ...liensServices];
};
