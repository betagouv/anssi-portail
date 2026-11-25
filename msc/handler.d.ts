import type { IncomingMessage, ServerResponse } from 'node:http';

export function handler(req: IncomingMessage, res: ServerResponse, next: () => void): void;
