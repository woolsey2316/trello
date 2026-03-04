import type { Request, Response } from 'express';
import List from '../models/list.model.js';

export class ListController {
  static async createList(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const newList = new List({ name });
      await newList.save();
      res.status(201).json(newList);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async getListsByBoardId(req: Request, res: Response) {
    try {
      const list = await List.find({ boardId: req.params.boardId });
      if (!list) return res.status(404).json({ error: 'List not found' });
      res.json(list);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async getListsById(req: Request, res: Response) {
    try {
      const list = await List.findById(req.params.id);
      if (!list) return res.status(404).json({ error: 'List not found' });
      res.json(list);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async updateList(req: Request, res: Response) {
    try {
      const { name, cardIds } = req.body;
      const updatedList = await List.findByIdAndUpdate(
        req.params.id,
        { name, cardIds },
        { new: true }
      );
      if (!updatedList) return res.status(404).json({ error: 'List not found' });
      res.json(updatedList);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteList(req: Request, res: Response) {
    try {
      const deletedList = await List.findByIdAndDelete(req.params.id);
      if (!deletedList) return res.status(404).json({ error: 'List not found' });
      res.json({ message: 'List deleted successfully' });
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }
}
