const Router = require('express');
const router = new Router();
const utilsController = require('../controllers/utilsController');

router.get('/get_years', utilsController.getYears);
router.get('/get_steps', utilsController.getContestSteps);

module.exports = router;