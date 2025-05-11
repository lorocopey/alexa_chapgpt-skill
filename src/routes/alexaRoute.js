const { Router } = require('express');
const router = Router();
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const { createSkill } = require('../skillHandler');

const skill = createSkill();

const adapter = new ExpressAdapter(skill, false, false);

router.post('/', adapter.getRequestHandlers());

module.exports = router;