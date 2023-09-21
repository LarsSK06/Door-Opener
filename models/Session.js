const {Model, DataTypes} = require("sequelize");

module.exports = class Session extends Model {
    static init(sequelize) {
        return super.init({
            sid: {type: DataTypes.STRING},
            expires: {type: DataTypes.STRING},
            data: {type: DataTypes.BOOLEAN},
            userId: {type:  DataTypes.BOOLEAN }
        },
        {
            tableName: "Sessions",
            sequelize
        })
    }
}