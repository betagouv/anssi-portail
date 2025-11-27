import { EntrepotGrist } from '../../src/infra/entrepotGrist';

export class EntrepotGristGenerique extends EntrepotGrist<{ test: string }> {
  async tous(): Promise<{ test: string }[]> {
    const resultat = await this.appelleGrist();
    return resultat.records;
  }

  async avecFiltre(filtre: number): Promise<{ test: string }[]> {
    const resultat = await this.appelleGrist({ id: [filtre] });
    return resultat.records;
  }
}
