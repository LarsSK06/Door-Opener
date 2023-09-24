const {Sequelize}= require('sequelize')
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);

const Users = require('../models/users')
const Session = require("../models/Session.js")
class DataBaseManager {
    constructor() {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './backend/database.sqlite', // Replace with the path to your SQLite database file,
            logging:false
        })
        this.initTables() // init all models
        this.sequelize.sync()
            .then(() => {
                console.log('Tables created successfully!')
            })
            .catch((error) => {
                console.error('Error creating tables:', error)
            })

    }
    async createAccount(username, password, enabled = true, isAdmin = false) { // DO NOT USE USER MADE PASSWORDS
        Users.create({
            name: username,
            password: password,
            enabled: enabled,
            isAdmin:isAdmin
        })
    }
    async login(password) {
        return await Users.findOne({where: {
            password: password
        }})
    }
    async findByName(name) {
        return await Users.findOne({where: {
            name: name
        }})
    }
    async getAll() {
        return await Users.findAll().then(entries => entries.map(({ dataValues: { name, enabled } }) => ({ name, enabled })))
    }
    updateEnabled(name, isEnabled) {
        Users.findOne({where: {name: name}}).then(user => user.update({enabled:isEnabled}))
    }

    store() {
        return new SessionStore({
            db: this.sequelize
        });
    }
    
    initTables() {
        Users.init(this.sequelize)
        Session.init(this.sequelize)
        Session.sync(this.db)
    }  
}


module.exports = DataBaseManager