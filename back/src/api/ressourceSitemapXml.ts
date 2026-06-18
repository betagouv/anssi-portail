import { Request, Response, Router } from 'express';
import fs, { writeFileSync } from 'fs';
import * as path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';

interface LienSitemap {
  url: string;
  modifieLe: Date;
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

export const ressourceSitemapXml = (pages: string[], configurationServeur: ConfigurationServeur) => {
  const cheminVersSitemapXml = configurationServeur.fournisseurChemin.sitemapXml();
  if (cheminVersSitemapXml.length === 0) return () => {};
  try {
    const sitemapStream = new SitemapStream({ hostname: 'https://messervices.cyber.gouv.fr' });

    const liens = recupereLiens(pages, configurationServeur);
    liens.forEach((lien) => {
      sitemapStream.write({
        url: lien.url,
        lastmod: lien.modifieLe.toISOString(),
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
