const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/appointments.controller');

router.use(auth);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
