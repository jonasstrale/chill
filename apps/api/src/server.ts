import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { healthRoutes } from './routes/health.js';
import { ledgerRoutes } from './routes/ledger.js';

export function buildServer() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: false });
  app.register(sensible);
  app.register(healthRoutes, { prefix: '/health' });
  app.register(ledgerRoutes, { prefix: '/ledgers' });

  return app;
}

const app = buildServer();

app.listen({ host: '0.0.0.0', port: 4000 }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
