import { Router } from "express";
import { BoardController } from "../controllers/board.controller.js";

const router = Router();

router.get("/", BoardController.getAllBoards);
router.post("/", BoardController.createBoard);
router.get("/:id", BoardController.getBoardById);
router.put("/:id", BoardController.updateBoardName);
router.patch("/:id", BoardController.updateBoardLists);
router.delete("/:id", BoardController.deleteBoard);

export default router;
