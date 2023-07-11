import { Router } from "express";
import productManager from "../dao/dbmanagers/product.manager.js";
import { io } from "../utils/server.util.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    res.send(await productManager.getProducts());
  } catch (err) {
    res.send(err);
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    res.send(await productManager.getProductById(req.params.pid));
  } catch (err) {
    res.send(err);
  }
});

productRouter.post("/", async (req, res) => {
  try {
    res.send(await productManager.addProduct(req.body));
    io.emit("newProd", req.body);
  } catch (err) {
    res.send(err);
  }
});

productRouter.put("/:pid", async (req, res) => {
  try {
    res
      
      .send(await productManager.updateProduct(req.params.pid, req.body));
  } catch (err) {
    res.send(err);
  }
});

productRouter.delete("/:pid", async (req, res) => {
  try {
    res.send(await productManager.deleteProduct(req.params.pid));
    io.emit("deletedProd", req.params.pid);
  } catch (err) {
    res.send(err);
  }
});

export default productRouter;
