import app from "./app";
import dotenv from "dotenv";
import connectToDB from "./database/connectToDB";
import http from "http";
import {connectToSocket} from "./sockets/socket";

dotenv.config();


const PORT = process.env.PORT;

const server = http.createServer(app);

const io = connectToSocket(server); 



server.listen(PORT, () => {       
  console.log(`running on port ${PORT}`);
  connectToDB();
});

