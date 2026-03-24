import type { FastifyInstance } from 'fastify';

export async function ledgerRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return {
      items: [
        { id: 'company', name: 'Company' },
        { id: 'personal', name: 'Personal' },
        { id: 'son', name: 'Son' },
        { id: 'aikido', name: 'Aikido Club' }
      ]
    };
  });
}
