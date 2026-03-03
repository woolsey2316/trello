import { Router } from 'express';
import { ListController } from '../controllers/list.controller.js';

const router = Router();

router.post('/', ListController.createList);
router.get('/:id', ListController.getListById);
router.put('/:id', ListController.updateList);
router.delete('/:id', ListController.deleteList);

export default router;
