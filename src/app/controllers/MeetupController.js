import Meetup from "../models/Meetup";
import * as Yup from "yup";
import { parseISO } from "date-fns";
import { Op } from "sequelize";
import dateUtil from "../../util/dateUtil";

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: "Validations fails" });
    }

    const { title, description, location, date, banner_id } = req.body;

    // Validation date later
    const dateWithParser = parseISO(date);
    const dateValidation = dateUtil.dateIsPassed(dateWithParser);
    if (dateValidation.error) {
      return res.status(401).json({ error: dateValidation.text });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date: dateWithParser,
      banner_id,
      user_id: req.userId
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: "Validations fails" });
    }

    const { id, title, description, location, date, banner_id } = req.body;
    const dateWithParser = parseISO(date);

    const existsMeetup = await Meetup.findOne({
      where: { id, date: { [Op.gte]: new Date() } }
    });

    if (!existsMeetup) {
      return res.status(400).json({ error: "Meetup not found." });
    }

    if (req.userId !== existsMeetup.user_id) {
      return res.status(400).json({ error: "User can't edit the meetup" });
    }

    // Validation date later
    const dateValidation = dateUtil.dateIsPassed(dateWithParser);
    if (dateValidation.error) {
      return res.status(401).json({ error: dateValidation.text });
    }

    const meetup = await existsMeetup.update({
      title,
      description,
      location,
      date: dateWithParser,
      banner_id,
      user_id: req.userId
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
