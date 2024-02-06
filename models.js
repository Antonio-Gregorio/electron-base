const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/database.sqlite' // Nome do arquivo do banco de dados SQLite
});

const Php = sequelize.define('phps', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    version: DataTypes.STRING,
    path: DataTypes.STRING,
    exe: DataTypes.STRING
}, {
    timestamps: false
});

const Settings = sequelize.define('settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    value: DataTypes.STRING
}, {
    timestamps: false
})

const Project = sequelize.define('projects', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    php_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    path: DataTypes.STRING
}, {
    timestamps: false
});


Project.belongsTo(Php, {foreignKey: 'php_id'});
Php.hasMany(Project, {foreignKey: 'php_id'});


module.exports = {
    Php: Php,
    Settings: Settings,
    Project: Project
}