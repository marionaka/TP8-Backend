import fs from "fs";

export default class CartsManager {
  #lastCartID = 0;

  async #getLastId() {
    let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    let oldIds = await cartList.map((prod) => prod.id);
    if (oldIds.length > 0) {
      return (this.#lastCartID = Math.max(...oldIds));
    }
  }

  async #getNewId() {
    await this.#getLastId();
    this.#lastCartID++;
    return this.#lastCartID;
  }

  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  async addCart(prodCart) {
    try {
      let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
      await cartList.forEach((cart) => {
        if (cart.id === prodCart.id) {
          console.log("Error: El ID ya existe");
        }
      });
      prodCart.id = await this.#getNewId(); //Función para generar el id automáticamente
      cartList.push(prodCart);  //Añadido del carrito al array
      await fs.promises.writeFile(this.path, JSON.stringify(cartList));
    } catch (err) {
      console.log(`Error al agregar el carrito: ${err}`);
    }
  }

  async getCarts() {
    try {
      let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
      return cartList;
    } catch (err) {
      console.log(`Error al obtener los carritos: ${err}`);
    }
  }

  async getCartById(id) {
    try {
      let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));

      return cartList.find((cart) => {
        return cart.id === id;
      });
    } catch (err) {
      console.log(`Error al obtener el carrito por ID: ${err}`);
    }
  }

  async addProdtoCart(cid, pid) {
    try {
      let cartList = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
      let selectedCart = cartList.find((cart) => {
        return cart.id == cid;
      });

      let prodList = JSON.parse(
        await fs.promises.readFile("./products.json", "utf-8")
      );
      let selectedProduct = prodList.find((prod) => {
        return prod.id == pid;
      });

      let prodFound = false;
      let oldProd;

      selectedCart.products.forEach((prod) => {
        if (prod.id === selectedProduct.id) {
          prodFound = true;
          oldProd = prod;
        }
      });

      if (prodFound) {
        oldProd.quantity++; //Si el producto existe, se aumenta su cantidad en 1
      } else {
        selectedCart.products.push({ id: selectedProduct.id, quantity: 1 });      }
      await fs.promises.writeFile(this.path, JSON.stringify(cartList));
    } catch (err) {
      console.log(`Error al agregar el producto al carrito por ID: ${err}`);
    }
  }

  async deleteCart(id) {
    try {
      let cartList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      cartList = await cartList.filter((cart) => {
        return cart.id !== id;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(cartList));
    } catch (err) {
      console.log(`Error al borrar el producto por ID: ${err}`);
    }
  }
}
