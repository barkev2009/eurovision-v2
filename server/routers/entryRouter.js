const Router = require('express');
const router = new Router();
const entryController = require('../controllers/entryController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), entryController.create);
router.delete('/:id', checkRole('ADMIN'), entryController.delete);
router.get('/by_id/:id', entryController.getById);
router.get('/by_contestant/:id', entryController.getByContestant);

module.exports = router;