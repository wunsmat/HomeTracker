const express = require('express');
const router = express.Router();
const controller = require('../controllers/anime');
const loggedIn = require('../middleware/auth').loggedIn;

router.use(loggedIn);
router.get('/', (req, res) => controller.findAndRender(res));
router.post('/add', (req, res) => controller.add(req, res));
router.post('/remove', (req, res) => controller.remove(req, res));
router.post('/complete', (req, res) => controller.updateCompleted(req, res, true));
router.post('/watch', (req, res) => controller.updateCompleted(req, res, false));

module.exports = router;