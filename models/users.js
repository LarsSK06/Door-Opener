const {Sequelize, DataTypes} = require("sequelize");

module.exports = class Users extends Model{
    static init(sequelize){
        return super.init({
            name: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING
            },
            enabled: {
                type: DataTypes.BOOLEAN
            },
            isAdmin: {type:  DataTypes.BOOLEAN }
        },
        {
            tableName: "Users",
            sequelize
        })
    }
}