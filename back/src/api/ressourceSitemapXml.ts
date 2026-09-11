import matter from '@11ty/gray-matter';
import { Request, Response, Router } from 'express';
import fs, { writeFileSync } from 'fs';
import { basename } from 'node:path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { ConfigurationServeur } from './configurationServeur.js';
import { siteFront } from './fournisseurChemin.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

interface LienSitemap {
  url: string;
  modifiéLe?: Date | undefined;
}

const récupèreLiens = (pages: string[], { fournisseurChemin }: ConfigurationServeur): LienSitemap[] => {
  const pagesRenommées = {
    '/front.html': '/front/accueil.html',
    '/cyberdepart.html': '/demande-aide-mon-aide-cyber.html',
    '/prestataires-labellises.html': '/prestataires.html',
    '/faire-le-test.html': '/mini-tests.html',
    '/vrai-faux.html': '/mini-test-vrai-faux.html',
    '/vrai-faux/quiz.html': '/mini-test-vrai-faux-quiz.html',
  };

  return pages.map((page): LienSitemap => {
    const cheminFichier = fournisseurChemin.jekyll.page(page);
    let cheminOriginel = cheminFichier.replace('/_site/', '/');
    cheminOriginel = cheminOriginel.replace('/index.', '.');
    for (const [pageRenomméParJekyll, nomFichierOriginel] of Object.entries(pagesRenommées)) {
      if (cheminOriginel.endsWith(pageRenomméParJekyll)) {
        cheminOriginel = cheminOriginel.replace(pageRenomméParJekyll, nomFichierOriginel);
        break;
      }
    }

    const données = matter(fs.readFileSync(cheminOriginel, 'utf-8')).data;
    return {
      url: page,
      modifiéLe: données.modifiéLe ? new Date(données.modifiéLe) : undefined,
    };
  });
};

export const ressourceSitemapXml = (pagesStatiques: string[], configurationServeur: ConfigurationServeur) => {
  const cheminVersSitemapXml = configurationServeur.fournisseurChemin.front.sitemapXml();
  if (cheminVersSitemapXml.length === 0) return () => {};
  try {
    const sitemapStream = new SitemapStream({ hostname: 'https://messervices.cyber.gouv.fr' });

    const liensStatiques = récupèreLiens(pagesStatiques, configurationServeur);
    liensStatiques.forEach((lien) => {
      sitemapStream.write({
        url: lien.url,
        lastmod: lien.modifiéLe?.toISOString(),
      });
    });

    construitRoutesDynamiques(configurationServeur).then((liensDynamiques) => {
      liensDynamiques.forEach((lien: LienSitemap) => {
        sitemapStream.write({
          url: lien.url,
          lastmod: lien.modifiéLe?.toISOString(),
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

  const liensGuides = (await entrepotGuide.tous()).map((guide): LienSitemap => ({
    url: `/guides/${guide.id}`,
    modifiéLe: guide.dateMiseAJour,
  }));

  const contientFicheDétaillée = (chemin: string) => {
    chemin = chemin.replace('site/', '').replace('.html', '.md');
    const contenuDuFichier = fs.readFileSync(chemin, 'utf-8');
    return contenuDuFichier.includes('avecFicheDetaillee: true');
  };

  const liensRessources = siteFront
    .fichiers()
    .filter((f) => f.indexOf('front/_site/ressources') >= 0)
    .filter((f) => f.indexOf('.html') >= 0)
    .filter(contientFicheDétaillée)
    .map((f): LienSitemap => {
      const cheminOriginel = f.replace('/_site/ressources/', '/_ressources/').replace('.html', '.md');
      const données = matter(fs.readFileSync(cheminOriginel, 'utf-8')).data;
      return { url: `/ressources/${basename(f, '.html')}`, modifiéLe: new Date(données.modifiéLe) };
    });

  const liensServices = siteFront
    .fichiers()
    .filter((f) => f.indexOf('front/_site/services') >= 0)
    .filter((f) => f.indexOf('.html') >= 0)
    .filter((f) => f.indexOf('index.html') < 0)
    .filter(contientFicheDétaillée)
    .map((f): LienSitemap => {
      const cheminOriginel = f.replace('/_site/services/', '/_services/').replace('.html', '.md');
      const données = matter(fs.readFileSync(cheminOriginel, 'utf-8')).data;
      return { url: `/services/${basename(f, '.html')}`, modifiéLe: new Date(données.modifiéLe) };
    });

  const liensContactsRégionaux = siteFront
    .fichiers()
    .filter((f) => f.indexOf('front/_site/contacts') >= 0)
    .filter((f) => f.indexOf('.html') >= 0)
    .filter((f) => f.indexOf('index.html') < 0)
    .map((f): LienSitemap => {
      const cheminOriginel = f.replace('/_site/contacts/', '/_contacts/').replace('.html', '.md');
      const données = matter(fs.readFileSync(cheminOriginel, 'utf-8')).data;
      return { url: `/contacts/${basename(f, '.html')}`, modifiéLe: new Date(données.modifiéLe) };
    });

  return [...liensFinancement, ...liensGuides, ...liensRessources, ...liensServices, ...liensContactsRégionaux];
};
