import dotenv from 'dotenv';

dotenv.config();
export const apiURL = process.env.API_WEBSITE_URL;

export const mongoDBUrl = process.env.MONGODB_URL

export const Port = process.env.PORT


// require("dotenv").config();

// const http = require("http");
// const { neon } = require("@neondatabase/serverless");

// const sql = neon(process.env.DATABASE_URL);

// const requestHandler = async (req, res) => {
//   const result = await sql`SELECT version()`;
//   const { version } = result[0];
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end(version);
// };

// http.createServer(requestHandler).listen(3000, () => {
//   console.log("Server running at http://localhost:3000");
// });