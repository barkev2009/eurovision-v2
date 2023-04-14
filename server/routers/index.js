const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const countryRouter = require('./countryRouter');

router.use('/user', userRouter);
router.use('/country', countryRouter);

module.exports = router;