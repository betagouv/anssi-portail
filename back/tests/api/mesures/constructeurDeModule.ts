import { Module } from '../../../src/metier/module.js';

export class ConstructeurDeModule {
  private id: number = 999;
  private nom: string = '';
  private description: string = '';

  avecLId(id: number): this {
    this.id = id;
    return this;
  }
  avecLeNom(nom: string): this {
    this.nom = nom;
    return this;
  }

  avecLaDescription(description: string): this {
    this.description = description;
    return this;
  }

  construis(): Module {
    return new Module(this.id, this.nom, this.description);
  }
}
