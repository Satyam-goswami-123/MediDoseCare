const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/medicines.controller');

router.use(auth);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/logs', ctrl.getDoseLogs);
router.get('/:id', ctrl.getOne);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.patch('/logs/:logId', ctrl.updateDose);

module.exports = router;
