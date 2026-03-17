import express from "express";
import { createDentist, getDentists } from "../controllers/dentistController.js";

const router = express.Router();

router.get("/", getDentists);
router.post("/", createDentist);

export default router;

