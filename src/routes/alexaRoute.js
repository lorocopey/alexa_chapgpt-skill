const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const { createSkill } = require('../skillHandler');

const alexaApp = express();

const skill = createSkill();

const adapter = new ExpressAdapter(skill, false, false);

alexaApp.post('/', adapter.getRequestHandlers());

module.exports = alexaApp;