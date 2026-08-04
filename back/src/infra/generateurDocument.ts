import { NodeAddFontBlobs, NodeAddFontPaths, NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';

export class ErreurTypst extends Error {
  constructor(message: string) {
    super(`[TYPST]: ${message}`);
  }
}

type ParametreTypst = {
  données?: Record<string, string>;
  polices?: Array<NodeAddFontPaths | NodeAddFontBlobs>;
};

type ArgumentsPourGenerateurDeDocument = { contenuFichier: string } | { cheminFichier: string };

export const generateurDocument = async (args: ArgumentsPourGenerateurDeDocument & ParametreTypst) => {
  const compilateur = NodeCompiler.create({
    workspace: process.cwd(),
    fontArgs: args.polices,
    inputs: args.données,
  });

  const contenuCompilé = compilateur.compile({
    mainFileContent: 'contenuFichier' in args ? args.contenuFichier : undefined,
    mainFilePath: 'cheminFichier' in args ? args.cheminFichier : undefined,
  });

  if (contenuCompilé.hasError()) {
    const diagnostiques = contenuCompilé.takeDiagnostics()?.shortDiagnostics;

    if (!diagnostiques) {
      throw new ErreurTypst('Erreur dans le moteur de génération');
    }

    throw new ErreurTypst(
      diagnostiques
        .map(
          (e) =>
            `${e.message} at ${e.path}:[l${e.range?.start?.line}:${e.range?.start?.character} -> l${e.range?.end?.line}:${e.range?.end?.character}]`
        )
        .join('\n')
    );
  }

  if (!contenuCompilé.result) {
    throw new ErreurTypst('Le contenu généré est vide');
  }

  return compilateur.pdf(contenuCompilé.result);
};
