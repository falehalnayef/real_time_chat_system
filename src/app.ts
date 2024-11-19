import  express, { Request, Response }  from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import errorMiddleware from "./middlewares/error.middleware";
import path from "path";
dotenv.config();
const app = express();


 app.use(express.json());


// RoutesuserName
app.use(routes);

//error middlware
app.use(errorMiddleware);


app.get("/chat", (req: Request, res: Response)=>{
    
    const options = {
        root: path.join(__dirname)
    };

    const fileName = 'client/client.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    }); 
})                      
 export default app;    