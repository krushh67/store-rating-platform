const storeService = require('../services/storeService');

const getStores = async (req, res, next) => {
  try {
    const stores = await storeService.getStores(req.query, req.user.id);
    res.json({ success: true, data: stores });
  } catch (err) { next(err); }
};

const getStoreById = async (req, res, next) => {
  try {
    const store = await storeService.getStoreById(req.params.id, req.user.id);
    res.json({ success: true, data: store });
  } catch (err) { next(err); }
};

module.exports = { getStores, getStoreById };
