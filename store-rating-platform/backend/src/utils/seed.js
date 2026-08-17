require('dotenv').config({ path: '../../.env' });
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { User, Store, Rating } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const hash = pwd => bcrypt.hash(pwd, 12);

    const [admin] = await User.findOrCreate({
      where: { email: 'admin@storerating.com' },
      defaults: {
        name: 'System Administrator User',
        email: 'admin@storerating.com',
        password: await hash('Admin@123'),
        address: '123 Admin Street, Tech City',
        role: 'ADMIN',
      },
    });

    const [owner1] = await User.findOrCreate({
      where: { email: 'owner1@storerating.com' },
      defaults: {
        name: 'Coffee Shop Owner Person One',
        email: 'owner1@storerating.com',
        password: await hash('Owner@123'),
        address: '456 Owner Lane, Business Park',
        role: 'STORE_OWNER',
      },
    });

    const [owner2] = await User.findOrCreate({
      where: { email: 'owner2@storerating.com' },
      defaults: {
        name: 'Restaurant Owner Person Two',
        email: 'owner2@storerating.com',
        password: await hash('Owner@123'),
        address: '789 Restaurant Road, Food Street',
        role: 'STORE_OWNER',
      },
    });

    const [user1] = await User.findOrCreate({
      where: { email: 'user1@storerating.com' },
      defaults: {
        name: 'Regular Platform User One',
        email: 'user1@storerating.com',
        password: await hash('User@1234'),
        address: '321 User Avenue, Residential Area',
        role: 'USER',
      },
    });

    const [user2] = await User.findOrCreate({
      where: { email: 'user2@storerating.com' },
      defaults: {
        name: 'Regular Platform User Two',
        email: 'user2@storerating.com',
        password: await hash('User@1234'),
        address: '654 Main Street, Downtown',
        role: 'USER',
      },
    });

    const [store1] = await Store.findOrCreate({
      where: { email: 'bestcoffee@store.com' },
      defaults: {
        name: 'Best Coffee Shop In Town',
        email: 'bestcoffee@store.com',
        address: '10 Coffee Street, Brew District',
        ownerId: owner1.id,
      },
    });

    const [store2] = await Store.findOrCreate({
      where: { email: 'deliciousfood@store.com' },
      defaults: {
        name: 'Delicious Food Restaurant Place',
        email: 'deliciousfood@store.com',
        address: '20 Food Avenue, Gourmet Quarter',
        ownerId: owner2.id,
      },
    });

    const [store3] = await Store.findOrCreate({
      where: { email: 'techstore@store.com' },
      defaults: {
        name: 'Tech Gadgets And Electronics Store',
        email: 'techstore@store.com',
        address: '30 Tech Boulevard, Innovation Hub',
        ownerId: null,
      },
    });

    await Rating.findOrCreate({
      where: { userId: user1.id, storeId: store1.id },
      defaults: { rating: 5 },
    });
    await Rating.findOrCreate({
      where: { userId: user2.id, storeId: store1.id },
      defaults: { rating: 4 },
    });
    await Rating.findOrCreate({
      where: { userId: user1.id, storeId: store2.id },
      defaults: { rating: 3 },
    });
    await Rating.findOrCreate({
      where: { userId: user2.id, storeId: store2.id },
      defaults: { rating: 5 },
    });

    console.log('✅ Seed complete!');
    console.log('\nDemo Credentials:');
    console.log('Admin:       admin@storerating.com / Admin@123');
    console.log('Store Owner: owner1@storerating.com / Owner@123');
    console.log('Store Owner: owner2@storerating.com / Owner@123');
    console.log('User:        user1@storerating.com / User@1234');
    console.log('User:        user2@storerating.com / User@1234');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
