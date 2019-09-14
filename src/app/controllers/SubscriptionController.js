import Subscription from "../models/Subscriprion";
import Meetup from "../models/Meetup";
import { Op } from "sequelize";
import { startOfHour, endOfHour, format } from "date-fns";
import Queue from "../../lib/Queue";
import User from "../models/User";
import NewSubscriberMail from "../jobs/NewSubscriberMail";

class SubscriptionController {
  async store(req, res) {
    const { id_meetup } = req.query;
    const existsMeetup = await Meetup.findOne({
      where: { id: id_meetup, date: { [Op.gte]: new Date() } },
      include: [
        {
          model: User,
          attributes: ["name", "email"]
        }
      ]
    });

    if (!existsMeetup) {
      return res.status(400).json({ error: "Meetup not found." });
    }

    if (req.userId === existsMeetup.user_id) {
      return res
        .status(401)
        .json({ error: "The User already is organizer of this meetup" });
    }

    const existsSubscription = await Subscription.findOne({
      where: {
        id_user: req.userId,
        id_meetup
      }
    });

    if (existsSubscription) {
      return res
        .status(401)
        .json({ error: "The User already is subscribed in this meetup" });
    }

    const subscriptionSameHour = await Subscription.findOne({
      where: {
        id_meetup: { [Op.ne]: id_meetup },
        id_user: req.userId
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: {
              [Op.between]: [
                startOfHour(existsMeetup.date),
                endOfHour(existsMeetup.date)
              ]
            }
          }
        }
      ]
    });

    if (subscriptionSameHour) {
      return res.status(401).json({
        error: "The User already is subscribed in other meetup at same hour"
      });
    }

    const subscription = await Subscription.create({
      id_user: req.userId,
      id_meetup
    });

    const user = await User.findByPk(req.userId);

    await Queue.add(NewSubscriberMail.key, {
      owner: existsMeetup.User.name,
      ownerEmail: existsMeetup.User.email,
      user: user.name,
      title: existsMeetup.title,
      date: existsMeetup.date
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
