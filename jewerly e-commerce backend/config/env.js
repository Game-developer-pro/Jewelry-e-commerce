const dotenv = require("dotenv");
dotenv.config();

const env = {
    mongoDB_url: process.env.MONGO_URL,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    appEmail: process.env.APP_EMAIL,
    appPassword: process.env.APP_PASSWORD,
    resendApiKey: process.env.RESEND_API_KEY
}

module.exports = env;
