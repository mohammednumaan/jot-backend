import express, { Express } from "express";
import HTTPRouter from "./router";
import { envData } from "./env";
import cors from "cors";

export default class HTTPServer {
  private readonly app: Express;
  private readonly port: number;
  private readonly httpRouter: HTTPRouter;

  constructor() {
    this.app = express();
    this.port = envData.PORT;
    this.httpRouter = new HTTPRouter();
  }

  async init() {
    this.startListening();
    this.initMiddleware();
  }

  private async initMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/static", express.static("public"));
    this.httpRouter.init("/api/v1", this.app);
  }

  private startListening() {
    this.app.listen(this.port, () => {
      console.log(`[Server]: Server is running on port ${this.port}`);
    });
  }
}
