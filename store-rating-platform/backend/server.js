require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');
require('./src/models'); // load all models & associations

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
};

start();
