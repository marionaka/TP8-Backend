import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import productRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.routers.js";
import messageRouter from "./routers/messages.router.js";
import userRouter from "./routers/users.router.js";
import viewsRouter from "./routers/views.router.js";
import * as path from "path";
import { app, io } from "./utils/server.util.js";
import messageManager from "./dao/dbmanagers/message.manager.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.set("views", "views/");

app.engine("handlebars", handlebars.engine());

app.set("view engine", "handlebars");

app.use(express.static(path.join(process.cwd() + "/public")));

mongoose.connect(
  "mongodb+srv://marianonakamura:pU77mD4xz87bI6Tr@codercluster.20kgbjc.mongodb.net/?retryWrites=true&w=majority",
  { dbName: "ecommerce" }
);

app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
      "mongodb+srv://marianonakamura:pU77mD4xz87bI6Tr@codercluster.20kgbjc.mongodb.net/?retryWrites=true&w=majority",
      dbName: "ecommerce",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 6000,
    }),
    secret: "pass123",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

io.on("connection", async (socket) => {
  socket.on("message", async (data) => {
    await messageManager.postMessage(data);
    io.emit("messageLogs", await messageManager.getMessages());
  });

  socket.on("sayhello", async (data) => {
    io.emit("messageLogs", await messageManager.getMessages());
    socket.broadcast.emit("alert", data);
  });
});
