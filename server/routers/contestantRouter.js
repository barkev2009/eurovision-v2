const Router = require('express');
const router = new Router();
const contestantController = require('../controllers/contestantController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), contestantController.create);
router.put('/:id', checkRole('ADMIN'), contestantController.edit);
router.get('/byId/:id', contestantController.getById);
router.delete('/:id', checkRole('ADMIN'), contestantController.delete);

module.exports = router;