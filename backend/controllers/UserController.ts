import express from 'express';
const router = express.Router();
const RenderMiddleware = require('../middleware/RenderMiddleware');

router.get('/', RenderMiddleware.userPage);

module.exports = router;