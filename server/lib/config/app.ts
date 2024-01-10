import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import { EmployeeRoutes } from "@/routes/employeeRoutes";

class App {
  public app: express.Application;

  private employeeRoutes: EmployeeRoutes = new EmployeeRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.mongoSetup();
    this.employeeRoutes.route(this.app);
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private mongoSetup(): void {
    mongoose
      .connect(`${process.env.DB_URL}`)
      .then(() => console.log("Mongo DB connected successfully."))
      .catch((error) => console.log("Error Connecting!", error));
  }
}

export default new App().app;
