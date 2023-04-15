const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const countryRouter = require('./countryRouter');
const contestantRouter = require('./contestantRouter');

router.use('/user', userRouter);
router.use('/country', countryRouter);
router.use('/contestant', contestantRouter);

module.exports = router;