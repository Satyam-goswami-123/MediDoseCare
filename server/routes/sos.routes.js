const router = require('express').Router();
const auth = require('../middleware/auth');
const { triggerSos } = require('../controllers/sos.controller');

router.use(auth);
router.post('/trigger', triggerSos);

module.exports = router;
