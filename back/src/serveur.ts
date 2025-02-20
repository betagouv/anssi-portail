import express, { NextFunction, Request, Response } from "express";
import { join } from "path";
import rateLimit from "express-rate-limit";

const app = express();

const centParMinute = rateLimit({ windowMs: 60 * 1000, limit: 100 });
app.use(centParMinute);

const sersPageJekyll = (requete: Request, reponse: Response) => {
  const cheminFichier = join(
    process.cwd(),
    "front",
    "_site",
    requete.url,
    "index.html",
  );
  reponse.status(200).set("Content-Type", "text/html").sendFile(cheminFichier);
};

[
  "/",
  "/parcours-debuter",
  "/parcours-approfondir",
  "/nis2",
  "/catalogue",
  "/test-maturite",
  "/niveaux-maturite",
].forEach((page) => {
  app.get(page, sersPageJekyll);
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

app.listen(3000, () => {
  console.log("Le serveur écoute sur le port 3000");
});
