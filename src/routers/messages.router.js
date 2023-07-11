import { Router } from "express";
import messageManager from "../dao/dbmanagers/message.manager.js";

const messageRouter = Router();

messageRouter.get("/", async (req, res) => {
  try {
    res.send(await messageManager.getMessages());
  } catch (err) {
    res.send(err);
  }
});

messageRouter.post("/", async (req, res) => {
  try {
    res.send(await messageManager.addMessage(req.body));
  } catch (err) {
    res.send(err);
  }
});

messageRouter.delete("/:mid", async (req, res) => {
  try {
    res.send(await messageManager.deleteMessage(req.params.mid));
  } catch (err) {
    res.send(err);
  }
});

export default messageRouter;
