import { Router } from "express";
import productManager from "../dao/dbmanagers/product.manager.js";
import messageManager from "../dao/dbmanagers/message.manager.js";
import cartManager from "../dao/dbmanagers/cart.manager.js";
import { isAuth, isGuest} from "../middlewares/auth.middleware.js";

const viewsRouter = Router();

viewsRouter.get("/", isGuest, (req, res) => {
  res.render("login", {
    title: "Iniciar sesión",
  });
});

viewsRouter.get("/products", isAuth, async (req, res) => {
  const { user } = req.session;
  delete user.password;
  const { limit, page, category, availability, sort } = req.query;
  const prodList = await productManager.getProducts(
    limit,
    page,
    category,
    availability,
    sort
  );
  prodList.status = "success";
  prodList.category = category;
  prodList.availability = availability;
  prodList.sort = sort;
  prodList.prevLink = prodList.hasPrevPage
    ? `products?page=${prodList.prevPage}`
    : "";
  prodList.nextLink = prodList.hasNextPage
    ? `products?page=${prodList.nextPage}`
    : "";
    res.render("products", {
      title: "Listado de Productos",
      prodList,
      user
    });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    res.render("cart", cart);
  } catch (err) {
    res.send(err);
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const prodList = await productManager.getProducts();
  res.render("realTimeProducts", { prodList });
});

viewsRouter.get("/chat", async (req, res) => {
  const renderMessages = await messageManager.getMessages();
  res.render("chat", { renderMessages });
});

viewsRouter.get("/register", isGuest, (req, res) => {
  res.render("register", {
    title: "Registrar nuevo usuario",
  });
});

viewsRouter.get("/registererror", (req, res) => {
  res.render("registererror", {
    title: "Error al registrarse",
  });
});

viewsRouter.get("/loginerror", (req, res) => {
  res.render("loginerror", {
    title: "Error al iniciar sesión",
  });
});

export default viewsRouter;