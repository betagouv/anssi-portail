import { describe, it, expect } from 'vitest';
import { Request } from 'express';
import { fabriqueCleRateLimit } from '../../src/api/clefRateLimit.js';

const requete = (ip: string, forwarded?: string): Request =>
  ({
    ip,
    headers: forwarded === undefined ? {} : { forwarded },
  }) as Request;

describe('La clé du rate-limit', () => {
  it("utilise l'adresse client du header Forwarded derrière un proxy de confiance", () => {
    const cle = fabriqueCleRateLimit(1)(requete('127.0.0.1', 'for=203.0.113.10;proto=https'));

    expect(cle).toBe('203.0.113.10');
  });

  it("normalise l'adresse IPv6 du client", () => {
    const cle = fabriqueCleRateLimit(1)(requete('127.0.0.1', 'for="[2001:db8::1]";proto=https'));

    expect(cle).toBe('2001:db8::/56');
  });

  it("n'utilise pas le header Forwarded sans proxy de confiance", () => {
    const cle = fabriqueCleRateLimit(0)(requete('127.0.0.1', 'for=203.0.113.10;proto=https'));

    expect(cle).toBe('127.0.0.1');
  });

  it("retombe sur l'adresse Express si le header Forwarded est invalide", () => {
    const cle = fabriqueCleRateLimit(1)(requete('127.0.0.1', 'not-a-forwarded-header'));

    expect(cle).toBe('127.0.0.1');
  });
});
