import { Router } from "express";
import { BoardController } from "../controllers/board.controller.js";

const router = Router();

router.get("/user/:userId", BoardController.getAllBoardsByUser);
router.post("/", BoardController.createBoard);
router.get("/:boardId/user/:userId", BoardController.getBoardById);
router.patch("/:id", BoardController.updateBoardName);
router.put("/:id", BoardController.addListToBoard);
router.delete("/:id/user/:userId", BoardController.deleteBoard);

export default router;
