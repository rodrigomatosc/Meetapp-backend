import { Router } from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import authMiddleware from "./app/middlewares/auth";
import multer from "multer";
import FileController from "./app/controllers/FileController";
import multerConfig from "./config/multer";
import MeetupController from "./app/controllers/MeetupController";

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

export default routes;
