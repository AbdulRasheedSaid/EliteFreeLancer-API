import dotenv from 'dotenv';

dotenv.config();
export const apiURL = process.env.API_WEBSITE_URL;

export const mongoDBUrl = process.env.MONGODB_URL

export const Port = process.env.PORT
