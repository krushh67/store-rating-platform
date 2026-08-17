const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');

const getStores = async ({ name, address, sortBy = 'name', order = 'asc' }, userId) => {
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };

  const allowedSort = ['name', 'address', 'createdAt'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const stores = await Store.findAll({
    where,
    include: [{ model: Rating, as: 'ratings', attributes: ['rating', 'userId'] }],
    order: [[sortField, sortOrder]],
  });

  return stores.map(s => {
    const store = s.toJSON();
    const ratings = store.ratings || [];
    const userRating = ratings.find(r => r.userId === userId);
    store.averageRating = ratings.length
      ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(2)
      : null;
    store.userRating = userRating ? userRating.rating : null;
    delete store.ratings;
    return store;
  });
};

const getStoreById = async (id, userId) => {
  const store = await Store.findByPk(id, {
    include: [{ model: Rating, as: 'ratings' }],
  });
  if (!store) throw { status: 404, message: 'Store not found' };
  const storeData = store.toJSON();
  const userRating = storeData.ratings.find(r => r.userId === userId);
  storeData.averageRating = storeData.ratings.length
    ? (storeData.ratings.reduce((a, b) => a + b.rating, 0) / storeData.ratings.length).toFixed(2)
    : null;
  storeData.userRating = userRating ? userRating.rating : null;
  return storeData;
};

module.exports = { getStores, getStoreById };
