import { env } from "process";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
