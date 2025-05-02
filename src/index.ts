import HTTPServer from "./server";

class Index {
  private readonly httpServer: HTTPServer;

  constructor() {
    this.httpServer = new HTTPServer();
  }

  async init() {
    this.httpServer.init();
  }
}

try {
  const index = new Index();
  index.init();
} catch (error) {
  console.error(`[Index]: Error initializing the server: ${error}`);
}
