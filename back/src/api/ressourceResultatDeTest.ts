import {ConfigurationServeur} from './configurationServeur';
import {Router} from 'express';
import {TestRealise} from "../bus/testRealise";

const ressourceResultatDeTest = ({busEvenement}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post("/", async (_, reponse) => {
    await busEvenement.publie(new TestRealise())
    reponse.sendStatus(201)
  });
  return routeur;
};

export {ressourceResultatDeTest};
