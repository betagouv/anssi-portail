import { Module } from '../../../src/metier/module.js';

export class ConstructeurDeModule {
  private id: number = 999;
  private nom: string = '';

  avecLId(id: number): this {
    this.id = id;
    return this;
  }
  avecLeNom(nom: string): this {
    this.nom = nom;
    return this;
  }

  construis(): Module {
    return new Module(this.id, this.nom);
  }
}
