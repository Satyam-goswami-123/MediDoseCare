const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/users.controller');

router.use(auth);
router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);

module.exports = router;
