const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const countryRouter = require('./countryRouter');
const contestantRouter = require('./contestantRouter');
const entryRouter = require('./entryRouter');
const ratingRouter = require('./ratingRouter');
const utilsRouter = require('./utilsRouter');
const adminRouter = require('./adminRouter');

router.use('/user', userRouter);
router.use('/country', countryRouter);
router.use('/contestant', contestantRouter);
router.use('/entry', entryRouter);
router.use('/rating', ratingRouter);
router.use('/utils', utilsRouter);
router.use('/admin', adminRouter);

module.exports = router;