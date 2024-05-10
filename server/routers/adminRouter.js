const Router = require('express');
const router = new Router();
const adminController = require('../controllers/adminController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/createRecords', checkRole('ADMIN'), adminController.createRecords);

module.exports = router;