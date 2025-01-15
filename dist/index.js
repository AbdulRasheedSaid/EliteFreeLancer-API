import express from "express";
import mongoose from "mongoose";
import { Port, mongoDBUrl } from "./config.js";
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import router from "./routes/index.js";
import author from "./routes/authorRoutes.js";
import category from "./routes/categoryRoutes.js";
import search from "./routes/search.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());
app.use('/api/author', author);
app.use('/api/category', category);
app.use('/search', search);
mongoose
    .connect(mongoDBUrl)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(Port, () => {
        console.log(`The server is running on http://localhost:${Port}....`);
    });
})
    .catch((error) => console.log(error));
app.use('/', router());
//# sourceMappingURL=index.js.map