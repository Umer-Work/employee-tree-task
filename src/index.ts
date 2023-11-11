// import multer from "multer";
import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/database";
import { createUser, getUserWithReportees } from "./components/user/user.controller";
import bodyParser from 'body-parser';



dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.post('/register', createUser);
app.get('/userWithReportees/:id', getUserWithReportees);


connectDatabase();

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});



