const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/notifications.controller');

router.use(auth);
router.get('/', ctrl.getAll);
router.patch('/:id/read', ctrl.markRead);
router.patch('/read-all', ctrl.markAllRead);

module.exports = router;
