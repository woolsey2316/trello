import { Router } from 'express';
import { CardController } from '../controllers/card.controller.js';

const router = Router();

router.post('/', CardController.createCard);
router.get('/:id', CardController.getCardById);
router.patch('/:id', CardController.updateCard);
router.delete('/:id', CardController.deleteCard);

export default router;
