import { creeServeur } from "./api/msc";

creeServeur().listen(3000, () => {
  console.log("Le serveur écoute sur le port 3000");
});
