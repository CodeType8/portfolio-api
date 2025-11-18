const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

module.exports = (deps) => {
  const ctrl = require('../controllers/portfolio.controller')(deps);

  // Fetch the authenticated user's complete portfolio.
  router.get('/me', requireAuth, ctrl.getMyPortfolio);
  // Fetch another user's portfolio by id.
  router.get('/user/:user_id', requireAuth, ctrl.getPortfolioByUser);

  // Create or update the base career record for the authenticated user.
  router.post('/', requireAuth, ctrl.upsertCareer);

  // Experience endpoints
  router.post('/:career_id/experiences', requireAuth, ctrl.createExperience);
  router.put('/experiences/:experience_id', requireAuth, ctrl.updateExperience);
  router.delete('/experiences/:experience_id', requireAuth, ctrl.deleteExperience);

  // Project endpoints
  router.post('/:career_id/projects', requireAuth, ctrl.createProject);
  router.put('/projects/:project_id', requireAuth, ctrl.updateProject);
  router.delete('/projects/:project_id', requireAuth, ctrl.deleteProject);

  // Education endpoints
  router.post('/:career_id/educations', requireAuth, ctrl.createEducation);
  router.put('/educations/:education_id', requireAuth, ctrl.updateEducation);
  router.delete('/educations/:education_id', requireAuth, ctrl.deleteEducation);

  // Skill endpoints
  router.post('/:career_id/skills', requireAuth, ctrl.createSkill);
  router.put('/skills/:skill_id', requireAuth, ctrl.updateSkill);
  router.delete('/skills/:skill_id', requireAuth, ctrl.deleteSkill);

  return router;
};
