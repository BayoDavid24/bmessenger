import express from "express";
import { getConversationsForSidebar, getMessages, getUsersForSidebar } from "../controllers/message.conroller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute)

router.get("/users", getUsersForSidebar)
router.get("/conversations", getConversationsForSidebar)
router.get("/:id", getMessages)
router.post("/send/:id", upload, sendMessages)

export default router;