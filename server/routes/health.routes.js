const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/health.controller');

router.use(auth);
router.get('/', ctrl.getLogs);
router.get('/latest', ctrl.getLatest);
router.post('/', ctrl.addLog);

module.exports = router;
