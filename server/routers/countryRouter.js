const Router = require('express');
const router = new Router();
const countryController = require('../controllers/countryController');

router.post('/', countryController.create);
router.get('/', countryController.getAllCountries);
router.get('/by_code/:code', countryController.getCountryByCode);
router.get('/by_name/:name', countryController.getCountryByName);

module.exports = router;