const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * Portfolio API Usage
 *
 * GET /api/portfolio/me
 *   - Auth: Required (Bearer token or session cookie)
 *   - Purpose: Return the authenticated user's full portfolio with career, experiences, projects, educations, and skills.
 *   - Query: optional `include` to toggle relations (e.g., include=projects,skills).
 *
 * GET /api/portfolio/user/:user_id
 *   - Auth: Required
 *   - Path params: `user_id` (number) - target user to inspect.
 *   - Purpose: Read another user's portfolio by id, useful for admin/editor review flows.
 *
 * POST /api/portfolio/
 *   - Auth: Required
 *   - Body: { headline: string, summary?: string, location?: string, website_url?: string, github_url?: string, linkedin_url?: string }
 *   - Purpose: Create or update the base Career record for the authenticated user; related resources attach to this career_id.
 *
 * POST /api/portfolio/:career_id/experiences
 *   - Auth: Required
 *   - Path params: `career_id` (number)
 *   - Body: { company_name: string, title: string, employment_type?: string, start_date: YYYY-MM-DD, end_date?: YYYY-MM-DD, is_current?: boolean, description?: string }
 *   - Purpose: Add a new experience row linked to the career.
 *
 * PUT /api/portfolio/experiences/:experience_id
 *   - Auth: Required
 *   - Path params: `experience_id` (number)
 *   - Body: any fields from the experience payload above to update.
 *   - Purpose: Edit an existing experience entry.
 *
 * DELETE /api/portfolio/experiences/:experience_id
 *   - Auth: Required
 *   - Path params: `experience_id` (number)
 *   - Purpose: Permanently remove an experience record from the profile.
 *
 * POST /api/portfolio/:career_id/projects
 *   - Auth: Required
 *   - Path params: `career_id` (number)
 *   - Body: { name: string, role?: string, description?: string, tech_stack?: string, link_url?: string, start_date?: YYYY-MM-DD, end_date?: YYYY-MM-DD }
 *   - Purpose: Attach a new project to the specified career.
 *
 * PUT /api/portfolio/projects/:project_id
 *   - Auth: Required
 *   - Path params: `project_id` (number)
 *   - Body: any fields from the project payload above to update.
 *   - Purpose: Modify an existing project entry.
 *
 * DELETE /api/portfolio/projects/:project_id
 *   - Auth: Required
 *   - Path params: `project_id` (number)
 *   - Purpose: Remove a project and detach it from the career.
 *
 * POST /api/portfolio/:career_id/educations
 *   - Auth: Required
 *   - Path params: `career_id` (number)
 *   - Body: { school_name: string, degree?: string, field_of_study?: string, start_date?: YYYY-MM-DD, end_date?: YYYY-MM-DD, grade?: string, summary?: string }
 *   - Purpose: Append a new education history item.
 *
 * PUT /api/portfolio/educations/:education_id
 *   - Auth: Required
 *   - Path params: `education_id` (number)
 *   - Body: any fields from the education payload above to update.
 *   - Purpose: Update an existing education entry.
 *
 * DELETE /api/portfolio/educations/:education_id
 *   - Auth: Required
 *   - Path params: `education_id` (number)
 *   - Purpose: Delete an education record.
 *
 * POST /api/portfolio/:career_id/skills
 *   - Auth: Required
 *   - Path params: `career_id` (number)
 *   - Body: { name: string, level?: 'beginner'|'intermediate'|'advanced'|'expert', category?: string, years_experience?: number }
 *   - Purpose: Create a new skill entry for the career.
 *
 * PUT /api/portfolio/skills/:skill_id
 *   - Auth: Required
 *   - Path params: `skill_id` (number)
 *   - Body: any fields from the skill payload above to update.
 *   - Purpose: Edit an existing skill entry.
 *
 * DELETE /api/portfolio/skills/:skill_id
 *   - Auth: Required
 *   - Path params: `skill_id` (number)
 *   - Purpose: Remove a skill from the portfolio.
 */

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
