const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

module.exports = (deps) => {
  const ctrl = require('../controllers/base.controller')(deps);

  // Base listing endpoint with search and pagination.
  router.get('/', ctrl.listBases);
  // Base detail endpoint.
  router.get('/:base_id', ctrl.getBaseById);

  // Authenticated creation of new bases.
  router.post('/', requireAuth, ctrl.createBase);
  // Authenticated update of existing bases.
  router.put('/:base_id', requireAuth, ctrl.updateBase);
  // Authenticated deletion of bases.
  router.delete('/:base_id', requireAuth, ctrl.deleteBase);

  return router;
};
