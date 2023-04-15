const Router = require('express');
const router = new Router();
const contestantController = require('../controllers/contestantController');

router.post('/', contestantController.create);
router.put('/:id', contestantController.edit);
router.get('/byId/:id', contestantController.getById);
router.delete('/:id', contestantController.delete);

module.exports = router;