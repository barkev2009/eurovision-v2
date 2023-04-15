const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const countryRouter = require('./countryRouter');
const contestantRouter = require('./contestantRouter');
const entryRouter = require('./entryRouter');
const ratingRouter = require('./ratingRouter');

router.use('/user', userRouter);
router.use('/country', countryRouter);
router.use('/contestant', contestantRouter);
router.use('/entry', entryRouter);
router.use('/rating', ratingRouter);

module.exports = router;