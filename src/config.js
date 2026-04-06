module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/finance_dashboard',
  jwtSecret: process.env.JWT_SECRET,
};