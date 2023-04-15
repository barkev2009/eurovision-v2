const Router = require('express');
const router = new Router();
const countryController = require('../controllers/countryController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), countryController.create);
router.put('/:code', checkRole('ADMIN'), countryController.edit);
router.get('/', countryController.getAllCountries);
router.get('/by_code/:code', countryController.getCountryByCode);
router.get('/by_name/:name', countryController.getCountryByName);

module.exports = router;