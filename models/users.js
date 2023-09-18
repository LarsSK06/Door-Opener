const {Sequelize, DataTypes} = require("sequelize");

module.exports = class user extends Model{
    static init(sequelize){
        return super.init({
            name: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: "users",
            sequelize
        })
    }
}