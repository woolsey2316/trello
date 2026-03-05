import type { Request, Response } from 'express';
import List from '../models/list.model.js';
import Card from '../models/card.model.js';

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

  static async addCardToList(req: Request, res: Response) {
    try {
      const list = await List.findById(req.params.listId);
      if (!list) return res.status(404).json({ error: 'List not found' });

      const { title, description, dueDate } = req.body;
      const newCard = await new Card({ title, description, dueDate }).save();

      await List.findByIdAndUpdate(
        req.params.listId,
        { $push: { cards: newCard._id } }
      );

      res.status(201).json(newCard);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async moveCard(req: Request, res: Response) {
    try {
      const { fromListId, toListId, toIndex } = req.body;
      const cardId = req.params.cardId as string;

      if (fromListId === toListId) {
        // Reorder within the same list
        const list = await List.findById(fromListId);
        if (!list) return res.status(404).json({ error: 'List not found' });

        const cards = list.cards.map((id) => id.toString());
        const currentIdx = cards.indexOf(cardId);
        if (currentIdx === -1) return res.status(404).json({ error: 'Card not in list' });

        cards.splice(currentIdx, 1);
        const insertAt = toIndex !== undefined ? Math.min(toIndex, cards.length) : cards.length;
        cards.splice(insertAt, 0, cardId);

        await List.findByIdAndUpdate(fromListId, { cards });
        return res.status(200).json({ message: 'Card reordered' });
      }

      // Move to a different list
      await List.findByIdAndUpdate(fromListId, { $pull: { cards: cardId } });

      if (toIndex !== undefined) {
        const toList = await List.findById(toListId);
        if (!toList) return res.status(404).json({ error: 'Destination list not found' });
        toList.cards.splice(toIndex, 0, cardId as any);
        await toList.save();
      } else {
        await List.findByIdAndUpdate(toListId, { $push: { cards: cardId } });
      }

      res.status(200).json({ message: 'Card moved' });
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }
}
