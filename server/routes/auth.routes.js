const router = require('express').Router();
const { sendOtp, verifyOtp, signup, login, socialLogin } = require('../controllers/auth.controller');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/signup', signup);
router.post('/login', login);
router.post('/social-login', socialLogin);

module.exports = router;
