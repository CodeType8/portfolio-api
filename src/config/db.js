const { Sequelize } = require('sequelize');
const config = require('./config');

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(config.db.dbName, config.db.user, config.db.passwd, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Sequelize: PostgreSQL connected successfully.');
    } catch (error) {
        console.error('Sequelize: Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };