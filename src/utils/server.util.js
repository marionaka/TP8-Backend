import { Server } from "socket.io";
import express from "express";

const app = express();
const httpServer = app.listen(8080, () => {
    console.log("Listening on port 8080");
  });
const io = new Server(httpServer);

export {app, io};