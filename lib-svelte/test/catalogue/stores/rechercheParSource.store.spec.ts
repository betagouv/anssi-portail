import { describe, expect, it } from "vitest";
import { rechercheParSource } from "../../../src/catalogue/stores/rechercheParSource.store";
import { DroitAcces, Source } from "../../../src/catalogue/Catalogue.types";
import { guidesTechniques, kitCyber, mss } from "./objetsExemples";
import { rechercheParDroitAcces } from "../../../src/catalogue/stores/rechercheParDroitAcces.store";
import { get } from "svelte/store";

describe("La recherche par source", () => {
  describe("lors d'un filtre ANSSI", () => {
    it("ne retourne pas l'item lorsque la primaire est ANSSI et la secondaire sélectionnée ne correspond pas", () => {
      rechercheParSource.set([Source.ANSSI, Source.CERTFR]);

      const resultat = rechercheParSource.ok(mss()); // mss = innovation

      expect(resultat).toBe(false);
    });

    it("retourne l'item lorsque la primaire est ANSSI et qu'il n'a pas de source secondaire", () => {
      rechercheParSource.set([Source.ANSSI, Source.CERTFR]);

      const resultat = rechercheParSource.ok(guidesTechniques()); // uniquement ANSSI

      expect(resultat).toBe(true);
    });

    it("ne retourne pas un item partenaire", ()=>{
      rechercheParSource.set([Source.ANSSI]);

      const resultat = rechercheParSource.ok(kitCyber()); // Gendarmerie

      expect(resultat).toBe(false);
    })
  });

  describe("lors d'un filtre Partenaires", () => {
    it("ne retourne pas un item avec une unique source ANSSI lorsque la recherche exclut l'ANSSI", () => {
      rechercheParSource.set([Source.PARTENAIRES]);

      const resultat = rechercheParSource.ok(guidesTechniques()); // uniquement ANSSI

      expect(resultat).toBe(false);
    });
    it("est un partenaire lorsque la source n'est pas connue", () => {
      rechercheParSource.set([Source.PARTENAIRES]);

      const resultat = rechercheParSource.ok(kitCyber()); // source = Gendarmerie

      expect(resultat).toBe(true);
    });
  });

  it("est vide quand on la réinitialise", () => {
    rechercheParSource.set([Source.PARTENAIRES]);

    rechercheParSource.reinitialise();

    expect(get(rechercheParSource)).toEqual([]);
  });

  it("ne retourne pas un item sans source", () => {
    rechercheParSource.set([Source.PARTENAIRES]);
    let sansSource = { ...guidesTechniques() };
    delete sansSource.sources;

    const resultat = rechercheParSource.ok(sansSource);

    expect(resultat).toBe(false);
  });
});
