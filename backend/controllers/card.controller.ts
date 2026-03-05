import type { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import Card from '../models/card.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
export const upload = multer({ storage });

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
      const { title, description, dueDate, labels, assignedTo, checklist } = req.body;
      const updatedCard = await Card.findByIdAndUpdate(
        req.params.id,
        { title, description, dueDate, labels, assignedTo, checklist },
        { new: true }
      );
      if (!updatedCard) return res.status(404).json({ error: 'Card not found' });
      res.json(updatedCard);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }

  static async uploadAttachment(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      const attachmentPath = `/uploads/${req.file.filename}`;
      const updatedCard = await Card.findByIdAndUpdate(
        req.params.id,
        { attachmentPath },
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
