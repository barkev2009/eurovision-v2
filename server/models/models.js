const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const { Sequelize } = require('../db');
const { FIRST_SEMIFINAL, SECOND_SEMIFINAL, GRAND_FINAL } = require('./enum');

const User = sequelize.define(
    'user',
    {
        id: {type: DataTypes.UUID, primaryKey: true, unique: true, allowNull: false, defaultValue: Sequelize.literal('uuid_in((md5((random())::text))::cstring)')},
        login: {type: DataTypes.STRING, unique: true, allowNull: false},
        password: {type: DataTypes.STRING, allowNull: true},
        name: {type: DataTypes.STRING, allowNull: true},
        role: {type: DataTypes.STRING, allowNull: false, defaultValue: 'USER'}
    }
)

const Country = sequelize.define(
    'country',
    {
        id: {type: DataTypes.UUID, primaryKey: true, unique: true, allowNull: false, defaultValue: Sequelize.literal('uuid_in((md5((random())::text))::cstring)')},
        icon: {type: DataTypes.STRING, allowNull: true},
        name: {type: DataTypes.STRING, allowNull: false, unique: true},
        code: {type: DataTypes.STRING, allowNull: false, unique: false}
    }
)

const Contestant = sequelize.define(
    'contestant',
    {
        id: {type: DataTypes.UUID, primaryKey: true, unique: true, allowNull: false, defaultValue: Sequelize.literal('uuid_in((md5((random())::text))::cstring)')},
        artist_name: {type: DataTypes.STRING, allowNull: false},
        song_name: {type: DataTypes.STRING, allowNull: false},
        year: {type: DataTypes.INTEGER, allowNull: false},
        qualifier: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
        place_in_final: {type: DataTypes.INTEGER, allowNull: true}
    }
)

const Entry = sequelize.define(
    'entry',
    {
        id: {type: DataTypes.UUID, primaryKey: true, unique: true, allowNull: false, defaultValue: Sequelize.literal('uuid_in((md5((random())::text))::cstring)')},
        entry_order: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        contest_step: {type: DataTypes.ENUM(FIRST_SEMIFINAL, SECOND_SEMIFINAL, GRAND_FINAL), allowNull: false}
    }
)

const Rating = sequelize.define(
    'rating',
    {
        id: {type: DataTypes.UUID, primaryKey: true, unique: true, allowNull: false, defaultValue: Sequelize.literal('uuid_in((md5((random())::text))::cstring)')},
        purity: {type: DataTypes.FLOAT, allowNull: false, defaultValue: 0},
        show: {type: DataTypes.FLOAT, allowNull: false, defaultValue: 0},
        difficulty: {type: DataTypes.FLOAT, allowNull: false, defaultValue: 0},
        originality: {type: DataTypes.FLOAT, allowNull: false, defaultValue: 0},
        sympathy: {type: DataTypes.FLOAT, allowNull: false, defaultValue: 0},
        score: {type: DataTypes.FLOAT, allowNull: false, defaultValue: 0}
    }
)

Rating.belongsTo(User);
User.hasMany(Rating);

Rating.belongsTo(Entry);
Entry.hasMany(Rating);

Entry.belongsTo(Contestant);
Contestant.hasMany(Entry);

Contestant.belongsTo(Country);
Country.hasMany(Contestant);

module.exports = {
    User, Rating, Entry, Contestant, Country
};