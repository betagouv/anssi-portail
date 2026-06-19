import { Module } from './module';

export interface EntrepôtModule {
  parId(id: number): Promise<Module | undefined>;
}
