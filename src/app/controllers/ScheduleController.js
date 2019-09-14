import { Op } from "sequelize";
import Meetup from "../models/Meetup";
import Subscription from "../models/Subscriprion";

class SchedulerController {
  async index(req, res) {
    const meetups = await Subscription.findAll({
      where: { id_user: req.userId },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: { [Op.gte]: new Date() }
          }
        }
      ],
      order: [[Meetup, "date", "asc"]]
    });

    return res.json(meetups);
  }
}

export default new SchedulerController();
