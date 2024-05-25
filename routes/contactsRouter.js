import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatus,
} from "../controllers/contactsControllers.js";

const router = express.Router();

router.use(auth); // Захист усіх маршрутів аутентифікацією

router.get("/", getAllContacts);
router.get("/:id", getOneContact);
router.post("/", createContact);
router.delete("/:id", deleteContact);
router.put("/:id", updateContact);
router.patch("/:id/favorite", updateStatus);

export default router;
