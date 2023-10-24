const {Model, DataTypes} = require("sequelize");

module.exports = class OpenedDoor extends Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: DataTypes.STRING,
            },
            method:{
                type:DataTypes.STRING
            }

        },
        {
            tableName: "OpenedDoor",
            sequelize
        })
    }
}