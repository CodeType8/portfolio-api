const { ok, fail } = require('../utils/response');

// Handles HTTP interactions for portfolio management flows.
module.exports = (deps) => {
  const portfolioService = require('../services/portfolio.service')(deps);

  // Loads the authenticated user's portfolio with all related sections.
  const getMyPortfolio = async (req, res) => {
    try {
      // Fetch the career with experiences, projects, education, and skills.
      const portfolio = await portfolioService.getPortfolioByUser(req.user.id);
      if (!portfolio) return fail(res, 'Portfolio not found', 404);
      return ok(res, portfolio);
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Loads the portfolio belonging to the specified user id.
  const getPortfolioByUser = async (req, res) => {
    try {
      // Extract user identifier from route params for lookup.
      const userId = Number(req.params.user_id);
      const portfolio = await portfolioService.getPortfolioByUser(userId);
      if (!portfolio) return fail(res, 'Portfolio not found', 404);
      return ok(res, portfolio);
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Creates or updates the root career record for the authenticated user.
  const upsertCareer = async (req, res) => {
    try {
      // Collect career-level fields from the incoming request body.
      const careerPayload = {
        headline: req.body.headline,
        summary: req.body.summary,
        location: req.body.location,
        website_url: req.body.website_url,
        github_url: req.body.github_url,
        linkedin_url: req.body.linkedin_url,
      };

      const career = await portfolioService.upsertCareerForUser(req.user.id, careerPayload);
      return ok(res, career, 'Career saved');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Creates a new experience entry beneath the provided career id.
  const createExperience = async (req, res) => {
    try {
      // Ensure the caller supplies the parent career identifier in the URL.
      const careerId = Number(req.params.career_id);
      const experiencePayload = {
        company_name: req.body.company_name,
        title: req.body.title,
        employment_type: req.body.employment_type,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        is_current: req.body.is_current,
        summary: req.body.summary,
      };

      const experience = await portfolioService.addExperience(req.user.id, careerId, experiencePayload);
      if (!experience) return fail(res, 'Career not found or unauthorized', 404);
      return ok(res, experience, 'Experience created');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Updates an existing experience while checking ownership.
  const updateExperience = async (req, res) => {
    try {
      // Pull experience identifier from URL parameters.
      const experienceId = Number(req.params.experience_id);
      const experiencePayload = {
        company_name: req.body.company_name,
        title: req.body.title,
        employment_type: req.body.employment_type,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        is_current: req.body.is_current,
        summary: req.body.summary,
      };

      const experience = await portfolioService.updateExperience(req.user.id, experienceId, experiencePayload);
      if (!experience) return fail(res, 'Experience not found or unauthorized', 404);
      return ok(res, experience, 'Experience updated');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Deletes an experience entry under the authenticated user's career.
  const deleteExperience = async (req, res) => {
    try {
      // Use the route parameter to identify the experience being removed.
      const experienceId = Number(req.params.experience_id);
      const deleted = await portfolioService.removeExperience(req.user.id, experienceId);
      if (!deleted) return fail(res, 'Experience not found or unauthorized', 404);
      return ok(res, {}, 'Experience deleted');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Creates a new project beneath the given career id.
  const createProject = async (req, res) => {
    try {
      // Validate that the project attaches to a specific career.
      const careerId = Number(req.params.career_id);
      const projectPayload = {
        name: req.body.name,
        role: req.body.role,
        description: req.body.description,
        tech_stack: req.body.tech_stack,
        link_url: req.body.link_url,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
      };

      const project = await portfolioService.addProject(req.user.id, careerId, projectPayload);
      if (!project) return fail(res, 'Career not found or unauthorized', 404);
      return ok(res, project, 'Project created');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Updates a project entry while enforcing ownership.
  const updateProject = async (req, res) => {
    try {
      // Identify the project via route params and apply incoming changes.
      const projectId = Number(req.params.project_id);
      const projectPayload = {
        name: req.body.name,
        role: req.body.role,
        description: req.body.description,
        tech_stack: req.body.tech_stack,
        link_url: req.body.link_url,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
      };

      const project = await portfolioService.updateProject(req.user.id, projectId, projectPayload);
      if (!project) return fail(res, 'Project not found or unauthorized', 404);
      return ok(res, project, 'Project updated');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Deletes a project entry owned by the authenticated user.
  const deleteProject = async (req, res) => {
    try {
      // Remove project when the ownership check passes.
      const projectId = Number(req.params.project_id);
      const deleted = await portfolioService.removeProject(req.user.id, projectId);
      if (!deleted) return fail(res, 'Project not found or unauthorized', 404);
      return ok(res, {}, 'Project deleted');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Creates an education record tied to the provided career id.
  const createEducation = async (req, res) => {
    try {
      // Link the education row to its career owner.
      const careerId = Number(req.params.career_id);
      const educationPayload = {
        school_name: req.body.school_name,
        degree: req.body.degree,
        field_of_study: req.body.field_of_study,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        grade: req.body.grade,
        summary: req.body.summary,
      };

      const education = await portfolioService.addEducation(req.user.id, careerId, educationPayload);
      if (!education) return fail(res, 'Career not found or unauthorized', 404);
      return ok(res, education, 'Education created');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Updates an education entry while verifying ownership.
  const updateEducation = async (req, res) => {
    try {
      // Capture the target education id from the URL.
      const educationId = Number(req.params.education_id);
      const educationPayload = {
        school_name: req.body.school_name,
        degree: req.body.degree,
        field_of_study: req.body.field_of_study,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        grade: req.body.grade,
        summary: req.body.summary,
      };

      const education = await portfolioService.updateEducation(req.user.id, educationId, educationPayload);
      if (!education) return fail(res, 'Education not found or unauthorized', 404);
      return ok(res, education, 'Education updated');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Deletes an education entry owned by the authenticated user.
  const deleteEducation = async (req, res) => {
    try {
      // Remove the education row after confirming ownership.
      const educationId = Number(req.params.education_id);
      const deleted = await portfolioService.removeEducation(req.user.id, educationId);
      if (!deleted) return fail(res, 'Education not found or unauthorized', 404);
      return ok(res, {}, 'Education deleted');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Creates a skill entry beneath the provided career id.
  const createSkill = async (req, res) => {
    try {
      // Attach the new skill to the specified career.
      const careerId = Number(req.params.career_id);
      const skillPayload = {
        name: req.body.name,
        level: req.body.level,
        category: req.body.category,
        years_experience: req.body.years_experience,
      };

      const skill = await portfolioService.addSkill(req.user.id, careerId, skillPayload);
      if (!skill) return fail(res, 'Career not found or unauthorized', 404);
      return ok(res, skill, 'Skill created');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Updates a skill entry while enforcing ownership.
  const updateSkill = async (req, res) => {
    try {
      // Retrieve the skill id from the URL to target updates.
      const skillId = Number(req.params.skill_id);
      const skillPayload = {
        name: req.body.name,
        level: req.body.level,
        category: req.body.category,
        years_experience: req.body.years_experience,
      };

      const skill = await portfolioService.updateSkill(req.user.id, skillId, skillPayload);
      if (!skill) return fail(res, 'Skill not found or unauthorized', 404);
      return ok(res, skill, 'Skill updated');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Deletes a skill entry tied to the authenticated user.
  const deleteSkill = async (req, res) => {
    try {
      // Delete the skill when it belongs to the caller's career.
      const skillId = Number(req.params.skill_id);
      const deleted = await portfolioService.removeSkill(req.user.id, skillId);
      if (!deleted) return fail(res, 'Skill not found or unauthorized', 404);
      return ok(res, {}, 'Skill deleted');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  return {
    getMyPortfolio,
    getPortfolioByUser,
    upsertCareer,
    createExperience,
    updateExperience,
    deleteExperience,
    createProject,
    updateProject,
    deleteProject,
    createEducation,
    updateEducation,
    deleteEducation,
    createSkill,
    updateSkill,
    deleteSkill,
  };
};
