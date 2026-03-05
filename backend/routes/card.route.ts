import { Router } from 'express';
import { CardController, upload } from '../controllers/card.controller.js';

const router = Router();

router.post('/', CardController.createCard);
router.get('/:id', CardController.getCardById);
router.patch('/:id', CardController.updateCard);
router.post('/:id/attachment', upload.single('file'), CardController.uploadAttachment);
router.delete('/:id', CardController.deleteCard);

export default router;
