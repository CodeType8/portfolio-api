'use strict';

//Auth
const User = require('./user');
const InvitationToken = require('./invitationToken');
const PasswordResetTokens = require('./passwordResetTokens')

// Portfolio
const Career = require('./career');
const Experience = require('./experience');
const Project = require('./project');
const Education = require('./education');
const Skill = require('./skill');

// Bar Menu
const Category = require('./category');
const Recipe = require('./recipe');

// Game Server
const Game = require('./game');

module.exports = (sequelize) => {
  const models = {
    User: User(sequelize),
    InvitationToken: InvitationToken(sequelize),
    PasswordResetTokens: PasswordResetTokens(sequelize),
    Career: Career(sequelize),
    Experience: Experience(sequelize),
    Project: Project(sequelize),
    Education: Education(sequelize),
    Skill: Skill(sequelize),
    Category: Category(sequelize),
    Recipe: Recipe(sequelize),
    Game: Game(sequelize),
  };

  // 🔹 Users ↔ Career
  models.User.hasOne(models.Career, { foreignKey: 'user_id' });
  models.Career.belongsTo(models.User, { foreignKey: 'user_id' });

  // 🔹 Career ↔ Experience
  models.Career.hasMany(models.Experience, { foreignKey: 'career_id' });
  models.Experience.belongsTo(models.Career, { foreignKey: 'career_id' });

  // 🔹 Career ↔ Project
  models.Career.hasMany(models.Project, { foreignKey: 'career_id' });
  models.Project.belongsTo(models.Career, { foreignKey: 'career_id' });

  // 🔹 Career ↔ Education
  models.Career.hasMany(models.Education, { foreignKey: 'career_id' });
  models.Education.belongsTo(models.Career, { foreignKey: 'career_id' });

  // 🔹 Career ↔ Skill
  models.Career.hasMany(models.Skill, { foreignKey: 'career_id' });
  models.Skill.belongsTo(models.Career, { foreignKey: 'career_id' });


  // 🔹 Career ↔ Recipe
  models.Category.hasMany(models.Recipe, { foreignKey: 'career_id' });
  models.Recipe.belongsTo(models.Category, { foreignKey: 'career_id' });

  return models;
};
