const Router = require('express');
const router = new Router();
const ratingController = require('../controllers/ratingController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), ratingController.create);
router.put('/:id', ratingController.edit);
router.put('/transfer/:id', ratingController.transferToFinal);
router.get('/by_id/:id', ratingController.getById);
router.get('/by_user/:id', ratingController.getByUser);
router.get('/by_user_entry', ratingController.getByUserEntry);
router.get('/by_user_contest', ratingController.getByUserContest);
router.get('/search', ratingController.search);

module.exports = router;