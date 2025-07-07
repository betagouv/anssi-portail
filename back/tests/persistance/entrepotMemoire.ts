export class EntrepotMemoire<T> {
  entites: T[] = [];

  async ajoute(entite: T) {
    this.entites.push(entite);
  }

  tous = async () => [...this.entites];

  taille = async () => this.entites.length;
}
