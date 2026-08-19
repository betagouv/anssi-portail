import { Request } from 'express';
import { ipKeyGenerator } from 'express-rate-limit';
import parseForwarded from 'forwarded-parse';

export const fabriqueCleRateLimit =
  (nombreProxiesDeConfiance: number) =>
  (requete: Request): string => {
    let adresseIp = requete.ip;

    if (nombreProxiesDeConfiance > 0) {
      const enteteForwarded = requete.headers.forwarded;
      if (typeof enteteForwarded === 'string') {
        try {
          const proxies = parseForwarded(enteteForwarded);
          const indexAdresseClient = proxies.length - nombreProxiesDeConfiance;
          adresseIp = proxies[indexAdresseClient]?.for ?? adresseIp;
        } catch {
          // Use Express' address when Forwarded is malformed.
        }
      }
    }

    const adresseIpNormalisée = (adresseIp ?? 'unknown').replace(/^\[(.*)\]$/, '$1');
    return ipKeyGenerator(adresseIpNormalisée);
  };
