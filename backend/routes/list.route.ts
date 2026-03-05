import { Router } from 'express';
import { ListController } from '../controllers/list.controller.js';

const router = Router();

router.post('/', ListController.createList);
router.get('/board/:boardId', ListController.getListsByBoardId);
router.get('/:id', ListController.getListsById);
router.put('/:id', ListController.updateList);
router.delete('/:id', ListController.deleteList);
router.post('/:listId/cards', ListController.addCardToList);
router.patch('/move/:cardId', ListController.moveCard);

export default router;
