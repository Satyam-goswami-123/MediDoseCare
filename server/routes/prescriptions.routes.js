const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/prescriptions.controller');

router.use(auth);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getOne);
router.delete('/:id', ctrl.remove);

module.exports = router;
