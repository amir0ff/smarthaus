// Set environment configurations
// Remember to keep your own JWT_SECRET keys private
const config = {
  "development": {
    "PORT": 80,
    "MONGODB_URI": "mongodb://127.0.0.1:27017/smarthaus",
    "JWT_SECRET": "SECRET#123",
    "JWT_EXP": "24h"
  },
  "production": {
    "PORT": process.env.PORT,
    "MONGODB_URI": "mongodb://xxxxx/DB_Name",
    "JWT_SECRET": "SECRET#123",
    "JWT_EXP": "24h"
  }
};

// Check process.env.NODE_ENV value if not set then default is 'development'
// For Production => process.env.NODE_ENV = 'production';
const env = process.env.NODE_ENV || 'development';
// Get environment configurations
const envConfig = config[env];
// Add environment configurations to process.env
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
