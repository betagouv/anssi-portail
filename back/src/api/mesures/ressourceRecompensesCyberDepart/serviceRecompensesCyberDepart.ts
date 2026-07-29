import { Canvas, GlobalFonts } from '@napi-rs/canvas';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const LARGEUR_BANNIERE = 996;
const HAUTEUR_BANNIERE = 420;
const X_TEXTE = 467;
const Y_TEXTE = 220;
const LARGEUR_TEXTE = 480;
const TAILLE_TEXTE = 18;
const TAILLE_TEXTE_MINIMALE = 14;
const Y_TEXTE_MAXIMUM = 326;
const SUFFIXE = 'agit pour sa cybersécurité en suivant le parcours de sécurisation proposé sur MesServicesCyber.';
const NOM_POLICE = 'MarianneCyberDepart';
const NOM_POLICE_GRASSE = 'MarianneCyberDepartGrasse';

export type ConfigurationRécompenseCyberDépart = {
  nomOrganisation: string;
};

type Mot = {
  contenu: string;
  gras: boolean;
};

const appliquePolice = (contexte: CanvasRenderingContext2D, taille: number, gras: boolean): void => {
  contexte.font = `${taille}px ${gras ? NOM_POLICE_GRASSE : NOM_POLICE}`;
};

const decoupeMotTropLong = (
  contexte: CanvasRenderingContext2D,
  mot: Mot,
  tailleTexte: number,
  largeurMaximale: number
): Mot[] => {
  appliquePolice(contexte, tailleTexte, mot.gras);
  const morceaux: Mot[] = [];
  let morceau = '';

  for (const caractere of mot.contenu) {
    if (morceau && contexte.measureText(morceau + caractere).width > largeurMaximale) {
      morceaux.push({ contenu: morceau, gras: mot.gras });
      morceau = caractere;
    } else {
      morceau += caractere;
    }
  }

  if (morceau) morceaux.push({ contenu: morceau, gras: mot.gras });
  return morceaux;
};

const mesureLigne = (contexte: CanvasRenderingContext2D, ligne: Mot[], tailleTexte: number): number =>
  ligne.reduce((largeur, mot, index) => {
    appliquePolice(contexte, tailleTexte, mot.gras);
    return largeur + contexte.measureText(`${index ? ' ' : ''}${mot.contenu}`).width;
  }, 0);

const decoupeEnLignes = (
  contexte: CanvasRenderingContext2D,
  motsInitiaux: Mot[],
  tailleTexte: number,
  largeurMaximale: number
): Mot[][] => {
  const mots = motsInitiaux.flatMap((mot) => {
    appliquePolice(contexte, tailleTexte, mot.gras);
    return contexte.measureText(mot.contenu).width > largeurMaximale
      ? decoupeMotTropLong(contexte, mot, tailleTexte, largeurMaximale)
      : [mot];
  });
  const lignes: Mot[][] = [];
  let ligne: Mot[] = [];

  for (const mot of mots) {
    const ligneCandidate = [...ligne, mot];
    if (ligne.length && mesureLigne(contexte, ligneCandidate, tailleTexte) > largeurMaximale) {
      lignes.push(ligne);
      ligne = [mot];
    } else {
      ligne = ligneCandidate;
    }
  }

  if (ligne.length) lignes.push(ligne);
  return lignes;
};

export class ServiceRécompensesCyberDépart {
  private modele?: Promise<Buffer>;
  private police?: Promise<void>;

  private chargeModele(): Promise<Buffer> {
    this.modele ??= readFile(fileURLToPath(new URL('./banniere.svg', import.meta.url)));
    return this.modele;
  }

  private chargePolice(): Promise<void> {
    this.police ??= Promise.all([
      readFile(fileURLToPath(new URL('./Marianne-Regular.woff2', import.meta.url))),
      readFile(fileURLToPath(new URL('./Marianne-Bold.woff2', import.meta.url))),
    ]).then(([policeNormale, policeGrasse]) => {
      if (!GlobalFonts.has(NOM_POLICE)) GlobalFonts.register(policeNormale, NOM_POLICE);
      if (!GlobalFonts.has(NOM_POLICE_GRASSE)) GlobalFonts.register(policeGrasse, NOM_POLICE_GRASSE);
    });
    return this.police;
  }

  async genereBanniere({ nomOrganisation }: ConfigurationRécompenseCyberDépart): Promise<Buffer> {
    await this.chargePolice();
    const calqueTexte = new Canvas(LARGEUR_BANNIERE, HAUTEUR_BANNIERE);
    const contexte = calqueTexte.getContext('2d');
    contexte.fillStyle = '#3A3A3A';
    const mots: Mot[] = [
      ...nomOrganisation.split(' ').map((contenu) => ({ contenu, gras: true })),
      ...SUFFIXE.split(' ').map((contenu) => ({ contenu, gras: false })),
    ];
    let tailleTexte = TAILLE_TEXTE;
    let interligne: number;
    let lignes: Mot[][];

    do {
      interligne = tailleTexte + 6;
      lignes = decoupeEnLignes(contexte as unknown as CanvasRenderingContext2D, mots, tailleTexte, LARGEUR_TEXTE);
      if (Y_TEXTE + (lignes.length - 1) * interligne <= Y_TEXTE_MAXIMUM) break;
      tailleTexte -= 1;
    } while (tailleTexte >= TAILLE_TEXTE_MINIMALE);

    lignes.forEach((ligne, indexLigne) => {
      let x = X_TEXTE;
      ligne.forEach((mot, indexMot) => {
        appliquePolice(contexte as unknown as CanvasRenderingContext2D, tailleTexte, mot.gras);
        const contenu = `${indexMot ? ' ' : ''}${mot.contenu}`;
        contexte.fillText(contenu, x, Y_TEXTE + indexLigne * interligne);
        x += contexte.measureText(contenu).width;
      });
    });

    const modeleSVG = await this.chargeModele();

    return await sharp(modeleSVG)
      .composite([{ input: calqueTexte.toBuffer('image/png') }])
      .resize({ width: LARGEUR_BANNIERE })
      .png()
      .toBuffer();
  }
}
