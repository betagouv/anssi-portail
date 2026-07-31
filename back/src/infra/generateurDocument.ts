import { NodeAddFontBlobs, NodeAddFontPaths, NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';

export class ErreurDeSyntaxe extends Error {
  constructor(message?: string) {
    super(message ? `[TYPST]: ${message}` : '[TYPST]: Erreur dans le moteur de génération');
  }
}

type ParametreTypst = {
  données?: Record<string, string>;
  polices?: Array<NodeAddFontPaths | NodeAddFontBlobs>;
};

type ArgumentsPourGenerateurDeDocument = { contenuFichier: string } | { cheminFichier: string };

// TODO: Les images sont commentées dans le attestation.typ et les font doivent être passées au constructeur.
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

    throw new ErreurDeSyntaxe(
      diagnostiques
        ?.map(
          (e) =>
            `${e.message} at ${e.path}:[l${e.range?.start?.line}:${e.range?.start?.character} -> l${e.range?.end?.line}:${e.range?.end?.character}]`
        )
        .join('\n')
    );
  }

  return compilateur.pdf(contenuCompilé.result!);
};
