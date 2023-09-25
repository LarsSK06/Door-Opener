const {Model, DataTypes} = require("sequelize");

module.exports = class Session extends Model {
    static init(sequelize) {
        return super.init({
            session_id: {type: DataTypes.STRING, primaryKey:true},
            expires: {type: DataTypes.STRING},
            data: {type: DataTypes.BOOLEAN},
        },
        {
            tableName: "Sessions",
            sequelize
        })
    }
}