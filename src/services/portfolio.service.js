// Provides data access helpers for managing the portfolio domain objects.
module.exports = ({ models }) => {
  const { Career, Experience, Project, Education, Skill } = models;

  // Retrieves a single career with all related portfolio sections for the given user.
  const getPortfolioByUser = (userId) => Career.findOne({
    where: { user_id: userId },
    include: [
      { model: Experience, separate: true, order: [['start_date', 'DESC'], ['created_at', 'DESC']] },
      { model: Project, separate: true, order: [['start_date', 'DESC'], ['created_at', 'DESC']] },
      { model: Education, separate: true, order: [['start_date', 'DESC'], ['created_at', 'DESC']] },
      { model: Skill, separate: true, order: [['level', 'DESC'], ['name', 'ASC']] },
    ],
  });

  // Finds or creates the career row for a user, updating it when it already exists.
  const upsertCareerForUser = async (userId, payload) => {
    // Ensure the user_id is always enforced from the authenticated context.
    const [career, created] = await Career.findOrCreate({
      where: { user_id: userId },
      defaults: { ...payload, user_id: userId },
    });

    // When an existing record is found, persist incoming changes.
    if (!created) {
      await career.update(payload);
    }

    return career;
  };

  // Ensures the requested career belongs to the requesting user before child mutations.
  const findCareerForUser = (userId, careerId) => Career.findOne({ where: { id: careerId, user_id: userId } });

  // Generic helper to create a child entity bound to a specific career and user.
  const createChildRecord = async (userId, careerId, model, payload) => {
    // Validate ownership before creating related data.
    const career = await findCareerForUser(userId, careerId);
    if (!career) return null;

    return model.create({ ...payload, career_id: career.id });
  };

  // Generic helper to update a child entity while enforcing career ownership.
  const updateChildRecord = async (userId, model, id, payload) => {
    // Load the record along with its parent career to confirm ownership.
    const record = await model.findOne({
      where: { id },
      include: [{ model: Career, where: { user_id: userId }, attributes: [] }],
    });

    if (!record) return null;

    await record.update(payload);
    return record;
  };

  // Generic helper to remove a child entity tied to the requesting user's career.
  const deleteChildRecord = async (userId, model, id) => {
    // Confirm the record belongs to the user's career before deleting.
    const record = await model.findOne({
      where: { id },
      include: [{ model: Career, where: { user_id: userId }, attributes: [] }],
    });

    if (!record) return false;

    await record.destroy();
    return true;
  };

  // Creates a new experience entry after validating career ownership.
  const addExperience = (userId, careerId, payload) => createChildRecord(userId, careerId, Experience, payload);

  // Updates an existing experience while enforcing ownership.
  const updateExperience = (userId, experienceId, payload) => updateChildRecord(userId, Experience, experienceId, payload);

  // Deletes an experience owned by the requesting user.
  const removeExperience = (userId, experienceId) => deleteChildRecord(userId, Experience, experienceId);

  // Creates a new project entry after validating career ownership.
  const addProject = (userId, careerId, payload) => createChildRecord(userId, careerId, Project, payload);

  // Updates a project while respecting ownership rules.
  const updateProject = (userId, projectId, payload) => updateChildRecord(userId, Project, projectId, payload);

  // Removes a project tied to the current user.
  const removeProject = (userId, projectId) => deleteChildRecord(userId, Project, projectId);

  // Creates an education record for the user's career.
  const addEducation = (userId, careerId, payload) => createChildRecord(userId, careerId, Education, payload);

  // Updates an education row with ownership enforcement.
  const updateEducation = (userId, educationId, payload) => updateChildRecord(userId, Education, educationId, payload);

  // Deletes an education row tied to the user's career.
  const removeEducation = (userId, educationId) => deleteChildRecord(userId, Education, educationId);

  // Creates a skill item for the user's career.
  const addSkill = (userId, careerId, payload) => createChildRecord(userId, careerId, Skill, payload);

  // Updates a skill entry while ensuring ownership.
  const updateSkill = (userId, skillId, payload) => updateChildRecord(userId, Skill, skillId, payload);

  // Deletes a skill row tied to the user's career.
  const removeSkill = (userId, skillId) => deleteChildRecord(userId, Skill, skillId);

  return {
    getPortfolioByUser,
    upsertCareerForUser,
    addExperience,
    updateExperience,
    removeExperience,
    addProject,
    updateProject,
    removeProject,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
  };
};
