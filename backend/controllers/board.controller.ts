import type { Request, Response } from "express";
import Board from "../models/board.model.js";

export class BoardController {
  static async getAllBoards(req: Request, res: Response) {
    try {
      const boards = await Board.find();
      res.json(boards);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async createBoard(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const newBoard = new Board({ name });
      await newBoard.save();
      res.status(201).json(newBoard);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async getBoardById(req: Request, res: Response) {
    try {
      const board = await Board.findById(req.params.id);
      if (!board) return res.status(404).json({ error: "Board not found" });
      res.json(board);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async updateBoardLists(req: Request, res: Response) {
    try {
      const { title, lists } = req.body;
      const updatedBoard = await Board.findByIdAndUpdate(
        req.params.id,
        { title, lists },
        { new: true }
      );
      if (!updatedBoard)
        return res.status(404).json({ error: "Board not found" });
      res.json(updatedBoard);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async updateBoardName(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const updatedBoard = await Board.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true }
      );
      if (!updatedBoard)
        return res.status(404).json({ error: "Board not found" });
      res.json(updatedBoard);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteBoard(req: Request, res: Response) {
    try {
      const deletedBoard = await Board.findByIdAndDelete(req.params.id);
      if (!deletedBoard)
        return res.status(404).json({ error: "Board not found" });
      res.json({ message: "Board deleted successfully" });
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }
}

