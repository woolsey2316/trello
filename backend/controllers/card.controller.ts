import type { Request, Response } from 'express';
import Card from '../models/card.model.js';

export class CardController {
  static async createCard(req: Request, res: Response) {
    try {
      const { title, description, dueDate } = req.body;
      const newCard = new Card({ title, description, dueDate });
      await newCard.save();
      res.status(201).json(newCard);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async getCardById(req: Request, res: Response) {
    try {
      const card = await Card.findById(req.params.id);
      if (!card) return res.status(404).json({ error: 'Card not found' });
      res.json(card);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCard(req: Request, res: Response) {
    try {
      const { title, description, dueDate, attachmentPath, labelIds, assignedTo } = req.body;
      const updatedCard = await Card.findByIdAndUpdate(
        req.params.id,
        { title, description, dueDate, attachmentPath, labelIds, assignedTo },
        { new: true }
      );
      if (!updatedCard) return res.status(404).json({ error: 'Card not found' });
      res.json(updatedCard);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteCard(req: Request, res: Response) {
    try {
      const deletedCard = await Card.findByIdAndDelete(req.params.id);
      if (!deletedCard) return res.status(404).json({ error: 'Card not found' });
      res.json({ message: 'Card deleted successfully' });
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }
}
