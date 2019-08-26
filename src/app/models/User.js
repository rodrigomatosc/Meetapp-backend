import Sequelize, { Model } from 'sequelize';
import bcripty from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize
      }
    );

    this.addHook('beforeSave', async user => {
      user.password_hash = await bcripty.hash(user.password, 8);
    });
  }

  checkPassword(password) {
    return bcripty.compare(password, this.password_hash);
  }
}

export default User;
