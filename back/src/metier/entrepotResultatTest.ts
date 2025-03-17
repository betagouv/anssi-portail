import {ResultatTestMaturite} from "./resultatTestMaturite";

export interface EntrepotResultatTest {
  ajoute(resultatTest: ResultatTestMaturite): Promise<void>;
}