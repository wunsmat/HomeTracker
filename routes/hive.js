const express = require('express');
const router = express.Router();
const controller = require('../controllers/hive');
const loggedIn = require('../middleware/auth').loggedIn;

router.use(loggedIn);
router.get('/', (req, res) => controller.findAndRender(res));
router.post('/inc/:name', (req, res) => controller.updateWins(req, res, 1));
router.post('/dec/:name', (req, res) => controller.updateWins(req, res, -1));

module.exports = router;
