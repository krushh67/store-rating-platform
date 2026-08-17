const adminService = require('../services/adminService');

const getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboard();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const createUser = async (req, res, next) => {
  try {
    const user = await adminService.createUser(req.body);
    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (err) { next(err); }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getUsers(req.query);
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

const createStore = async (req, res, next) => {
  try {
    const store = await adminService.createStore(req.body);
    res.status(201).json({ success: true, message: 'Store created successfully', data: store });
  } catch (err) { next(err); }
};

const getStores = async (req, res, next) => {
  try {
    const stores = await adminService.getStores(req.query);
    res.json({ success: true, data: stores });
  } catch (err) { next(err); }
};

module.exports = { getDashboard, createUser, getUsers, getUserById, createStore, getStores };
