import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ Ola: 'mundo' }));

export default routes;
