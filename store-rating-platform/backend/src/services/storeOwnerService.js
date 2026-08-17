const { Store, Rating, User } = require('../models');

const getDashboard = async (ownerId) => {
  const store = await Store.findOne({
    where: { ownerId },
    include: [{ model: Rating, as: 'ratings', include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }] }],
  });

  if (!store) throw { status: 404, message: 'No store found for this owner' };

  const ratings = store.ratings || [];
  const averageRating = ratings.length
    ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(2)
    : null;

  return {
    store: { id: store.id, name: store.name, email: store.email, address: store.address },
    averageRating,
    totalRatings: ratings.length,
    ratings: ratings.map(r => ({
      userName: r.user.name,
      userEmail: r.user.email,
      rating: r.rating,
      submittedAt: r.createdAt,
    })),
  };
};

module.exports = { getDashboard };
