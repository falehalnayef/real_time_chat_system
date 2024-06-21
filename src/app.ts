import  express  from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import errorMiddleware from "./middlewares/error.middleware";
dotenv.config();
const app = express();


 app.use(express.json());


// Routes
app.use(routes);

//error middlware
app.use(errorMiddleware);
 export default app;