const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, message: 'Registration successful', data: user });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json({ success: true, message: 'Login successful', data });
  } catch (err) { next(err); }
};

const updatePassword = async (req, res, next) => {
  try {
    await authService.updatePassword(req.user.id, req.body);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) { next(err); }
};

module.exports = { register, login, updatePassword };
