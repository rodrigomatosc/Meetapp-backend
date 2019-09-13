import { isBefore } from "date-fns";

export default {
  dateIsPassed: date => {
    return {
      error: isBefore(date, new Date()),
      text: "The date be passed."
    };
  }
};
