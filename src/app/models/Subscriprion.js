import { Model } from "sequelize";

class Subscription extends Model {
  static init(sequelize) {
    super.init({}, { sequelize });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "id_user" });
    this.belongsTo(models.Meetup, { foreignKey: "id_meetup" });
  }
}

export default Subscription;
