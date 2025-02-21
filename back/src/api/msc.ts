import express, { NextFunction, Request, Response } from "express";
import { ressourcePagesJekyll } from "./ressourcePagesJekyll";
import rateLimit from "express-rate-limit";
import { join } from "path";
import { ConfigurationServeur } from "./configurationServeur";

const creeServeur = (configurationServeur: ConfigurationServeur) => {
  const app = express();

  const centParMinute = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    skip: (req) => req.url.startsWith("/assets"),
  });
  app.use(centParMinute);

  [
    "",
    "catalogue",
    "parcours-debuter",
    "parcours-approfondir",
    "nis2",
    "test-maturite",
    "niveaux-maturite",
  ].forEach((page) => {
    app.use(`/${page}`, ressourcePagesJekyll(configurationServeur, page));
  });

  ["services", "ressources"].forEach((repertoireProduits) => {
    app.get(
      `/${repertoireProduits}/:id`,
      (requete: Request, reponse: Response, suite: NextFunction) => {
        const cheminFichier = join(
          process.cwd(),
          "front",
          "_site",
          repertoireProduits,
          requete.params.id,
        );
        reponse
          .status(200)
          .set("Content-Type", "text/html")
          .sendFile(cheminFichier, () => {
            if (!reponse.headersSent) suite();
          });
      },
    );
  });

  ["assets", "scripts", "lib-svelte", "favicon.ico"].forEach((ressource) => {
    app.use(
      `/${ressource}`,
      express.static(join(process.cwd(), "front", "_site", ressource)),
    );
  });

  app.use((_requete: Request, reponse: Response) => {
    reponse
      .status(404)
      .set("Content-Type", "text/html")
      .sendFile(join(process.cwd(), "front", "_site", "404.html"));
  });

  app.use((_requete: Request, reponse: Response) => {
    reponse
      .status(404)
      .set("Content-Type", "text/html")
      .sendFile(join(process.cwd(), "front", "_site", "404.html"));
  });

  return app;
};
export { creeServeur };
