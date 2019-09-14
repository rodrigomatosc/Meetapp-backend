import { Router } from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import authMiddleware from "./app/middlewares/auth";
import multer from "multer";
import FileController from "./app/controllers/FileController";
import multerConfig from "./config/multer";
import MeetupController from "./app/controllers/MeetupController";
import SubscriptionController from "./app/controllers/SubscriptionController";
import ScheduleController from "./app/controllers/ScheduleController";

const routes = new Router();
const upload = multer(multerConfig);

// --- Users
routes.post("/users", UserController.store);
routes.put("/users", authMiddleware, UserController.update);

// --- Session
routes.post("/sessions", SessionController.store);

// --- Files
routes.post("/files", upload.single("file"), FileController.store);

// --- Meetups
routes.post("/meetups", authMiddleware, MeetupController.store);
routes.put("/meetups", authMiddleware, MeetupController.update);
routes.delete("/meetups/:id", authMiddleware, MeetupController.delete);

// --- Subscription
routes.post("/subscriptions", authMiddleware, SubscriptionController.store);

// --- Scheduler
routes.get("/schedulers", authMiddleware, ScheduleController.index);

export default routes;
