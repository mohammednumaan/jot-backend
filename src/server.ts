import express, { Express } from 'express';

export default class HTTPServer {
    private readonly app: Express;
    private readonly port: number;

    constructor(){
        this.app = express();
        this.port = 3000;
    }

    async init(){
        this.startListening();
    }

    private startListening(){
        this.app.listen(this.port, () => {
            console.log(`[Server]: Server is running on port ${this.port}`);
        });
    }
}
