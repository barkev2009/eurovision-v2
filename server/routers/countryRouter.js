const Router = require('express');
const router = new Router();
const countryController = require('../controllers/countryController');

router.post('/', countryController.create);
router.get('/', countryController.getAllCountries);
router.get('/:code', countryController.getCountryByCode);

module.exports = router;