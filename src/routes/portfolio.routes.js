const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * Portfolio API wiring: covers career profile plus nested resources.
 */
module.exports = (deps) => {
  // Load the portfolio controller handling nested CRUD operations.
  const ctrl = require('../controllers/portfolio.controller')(deps);

  /**
   * GET /api/portfolio/me
   * - Purpose: Return the authenticated user's full portfolio (career + nested entries).
   * - Auth: Protected; relies on session/bearer token.
   */
  router.get('/me', requireAuth, ctrl.getMyPortfolio);

  /**
   * GET /api/portfolio/user/:user_id
   * - Purpose: Fetch another user's portfolio by user id for sharing/preview.
   * - Auth: Protected.
   * - Params: { user_id }
   */
  router.get('/user/:user_id', requireAuth, ctrl.getPortfolioByUser);

  /**
   * POST /api/portfolio
   * - Purpose: Create or update the root career profile for the caller.
   * - Auth: Protected.
   * - Body: { headline, summary?, location?, website_url?, github_url?, linkedin_url? }
   */
  router.post('/', requireAuth, ctrl.upsertCareer);

  /**
   * POST /api/portfolio/:career_id/experiences
   * - Purpose: Add a new work experience entry to a career.
   * - Auth: Protected.
   * - Body: { company_name, title, employment_type?, start_date, end_date?, is_current?, description? }
   */
  router.post('/:career_id/experiences', requireAuth, ctrl.createExperience);
  /**
   * PUT /api/portfolio/experiences/:experience_id
   * - Purpose: Update an existing experience entry.
   * - Auth: Protected.
   * - Body: Partial experience payload.
   */
  router.put('/experiences/:experience_id', requireAuth, ctrl.updateExperience);
  /**
   * DELETE /api/portfolio/experiences/:experience_id
   * - Purpose: Remove an experience item from the career timeline.
   * - Auth: Protected.
   */
  router.delete('/experiences/:experience_id', requireAuth, ctrl.deleteExperience);

  /**
   * POST /api/portfolio/:career_id/projects
   * - Purpose: Create a new project record associated with the career.
   * - Auth: Protected.
   * - Body: { name, role?, description?, tech_stack?, link_url?, start_date?, end_date? }
   */
  router.post('/:career_id/projects', requireAuth, ctrl.createProject);
  /**
   * PUT /api/portfolio/projects/:project_id
   * - Purpose: Update project details or links.
   * - Auth: Protected.
   */
  router.put('/projects/:project_id', requireAuth, ctrl.updateProject);
  /**
   * DELETE /api/portfolio/projects/:project_id
   * - Purpose: Remove a project entry from the portfolio.
   * - Auth: Protected.
   */
  router.delete('/projects/:project_id', requireAuth, ctrl.deleteProject);

  /**
   * POST /api/portfolio/:career_id/educations
   * - Purpose: Add an education record.
   * - Auth: Protected.
   * - Body: { school_name, degree?, field_of_study?, start_date?, end_date?, grade?, summary? }
   */
  router.post('/:career_id/educations', requireAuth, ctrl.createEducation);
  /**
   * PUT /api/portfolio/educations/:education_id
   * - Purpose: Update an education entry.
   * - Auth: Protected.
   */
  router.put('/educations/:education_id', requireAuth, ctrl.updateEducation);
  /**
   * DELETE /api/portfolio/educations/:education_id
   * - Purpose: Delete an education record.
   * - Auth: Protected.
   */
  router.delete('/educations/:education_id', requireAuth, ctrl.deleteEducation);

  /**
   * POST /api/portfolio/:career_id/skills
   * - Purpose: Attach a skill to the career profile.
   * - Auth: Protected.
   * - Body: { name, level?, category?, years_experience? }
   */
  router.post('/:career_id/skills', requireAuth, ctrl.createSkill);
  /**
   * PUT /api/portfolio/skills/:skill_id
   * - Purpose: Update an existing skill entry.
   * - Auth: Protected.
   */
  router.put('/skills/:skill_id', requireAuth, ctrl.updateSkill);
  /**
   * DELETE /api/portfolio/skills/:skill_id
   * - Purpose: Remove a skill from the profile.
   * - Auth: Protected.
   */
  router.delete('/skills/:skill_id', requireAuth, ctrl.deleteSkill);

  return router;
};
