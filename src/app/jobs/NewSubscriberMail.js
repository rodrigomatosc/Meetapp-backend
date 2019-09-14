import Mail from "../../lib/Mail";
import { format, parseISO } from "date-fns";

class NewSubscriberMail {
  get key() {
    return "NewSubscriber";
  }

  async handle({ data }) {
    const { owner, ownerEmail, user, title, date } = data;

    await Mail.sendMail({
      to: `${owner} <${ownerEmail}>`,
      subject: "Subscrition",
      template: "newSubscriber",
      context: {
        owner: owner,
        user,
        meetup: title,
        date: format(parseISO(date), "dd/MM/yyyy H:mm")
      }
    });
  }
}

export default new NewSubscriberMail();
