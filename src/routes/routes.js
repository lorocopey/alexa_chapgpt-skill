const { Router } = require('express');
const router = Router();

router.use('/alexa', require('./alexaRoute'));
router.use('/privacy-policy', require('./privacyPolicy.routes'));

module.exports = router;
