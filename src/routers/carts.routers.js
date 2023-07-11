import { Router } from "express";
import cartManager from "../dao/dbmanagers/cart.manager.js";

const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  try {
    res.send(await cartManager.getCarts());
  } catch (err) {
    res.send(err);
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    res.send(await cartManager.getCartById(req.params.cid));
  } catch (err) {
    res.send(err);
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    res.send(await cartManager.addCart(req.body));
  } catch (err) {
    res.send(err);
  }
});

cartRouter.put("/:cid", async (req, res) => {
  try {
    res.send(await cartManager.updateCart(req.params.cid, req.body));
  } catch (err) {
    res.send(err);
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    res.send(await cartManager.deleteAllProds(req.params.cid));
  } catch (err) {
    res.send(err);
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    res.send(await cartManager.addProdtoCart(req.params.cid, req.params.pid));
  } catch (err) {
    res.send(err);
  }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    res.send(await cartManager.deleteProdfromCart(req.params.cid, req.params.pid));
  } catch (err) {
    res.send(err);
  }
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    res.send(await cartManager.updateProdfromCart(req.params.cid, req.params.pid, req.body));
  } catch (err) {
    res.send(err);
  }
});

export default cartRouter;
