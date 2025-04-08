export class EntrepotMemoire<T>  {
  entites:T[] = [];
  
  ajoute = async (entite: T) => {
    this.entites.push(entite);
  };
}
