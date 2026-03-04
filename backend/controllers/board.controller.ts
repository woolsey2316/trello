import type { Request, Response } from "express";
import Board from "../models/board.model.js";
import List from "../models/list.model.js";

export class BoardController {
  static async getAllBoardsByUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const boards = await Board.find({ userId }).sort({ createdAt: -1 });
      res.json(boards);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async createBoard(req: Request, res: Response) {
    try {
      const { name, userId } = req.body;
      const newBoard = new Board({ name, userId });
      await newBoard.save();
      res.status(201).json(newBoard);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async getBoardById(req: Request, res: Response) {
    try {
      const board = await Board.findById(req.params.boardId);
      if (!board) return res.status(404).json({ error: "Board not found" });
      if (board.userId.toString() !== req.params.userId)
        return res.status(403).json({ error: "Unauthorized" });

      const populatedBoard = await Board.findById(req.params.boardId).populate({
        path: "lists",
        populate: { path: "cards" }
      });
      ;
      if (!populatedBoard) return res.status(404).json({ error: "Board not found" });
      res.json(populatedBoard);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async addListToBoard(req: Request, res: Response) {
    try {
      const board = await Board.findById(req.params.id);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }
      if (board.userId.toString() !== req.body.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const newList = await new List({ name: req.body.name, boardId: req.params.id }).save();

      const updatedBoard = await Board.findByIdAndUpdate(
        req.params.id,
        { $push: { lists: newList._id } },
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
      const { name, userId } = req.body;
      const boardToUpdate = await Board.findById(req.params.id)
      if (boardToUpdate?.userId.toString() !== userId)
        return res.status(403).json({ error: "Unauthorized" });

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
      const boardToDelete = await Board.findById(req.params.id)
      if (!boardToDelete)
        return res.status(404).json({ error: "Board not found" });
      if (boardToDelete.userId.toString() !== req.params.userId)
        return res.status(403).json({ error: "Unauthorized" });

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

