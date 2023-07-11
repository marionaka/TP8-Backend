import * as fs from "fs";

export default class ProductManager {
  #lastProdID = 0;

  async #getLastId() {
    let productList = JSON.parse(
      await fs.promises.readFile(this.path, "utf-8")
    );
    let oldIds = await productList.map((prod) => prod.id);
    if (oldIds.length > 0) {
      return (this.#lastProdID = Math.max(...oldIds));
    }
  }

  async #getNewId() {
    await this.#getLastId();
    this.#lastProdID++;
    return this.#lastProdID;
  }

  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  async addProduct(product) {
    try {
      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.status ||
        !product.stock ||
        !product.category
      ) {
        console.log("Error: Todos los campos deben ser completados");
      } else {
        let foundCode = false;
        let productList = JSON.parse(
          await fs.promises.readFile(this.path, "utf-8")
        );
        productList.forEach((prod) => {
          if (prod.code === product.code) {
            foundCode = true;
          }
        });
        if (!foundCode) {
          product.id = await this.#getNewId();
          productList.push(product);
          await fs.promises.writeFile(this.path, JSON.stringify(productList));
          return;
        } else {
          console.log("Error: El código de producto ya existe");
        }
      }
    } catch (err) {
      console.log(`Error al agregar el producto: ${err}`);
    }
  }

  async getProducts() {
    try {
      let productList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      return productList;
    } catch (err) {
      console.log(`Error al obtener los productos: ${err}`);
    }
  }


  async getProductById(id) {
    try {
      let productList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );

      return productList.find((prod) => {
        return prod.id === id;
      });
    } catch (err) {
      console.log(`Error al obtener el producto por ID: ${err}`);
    }
  }

  async updateProduct(id, changes) {
    try {
      let productList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      let prodIndex = await productList.findIndex((prod) => prod.id === id);
      if (prodIndex !== -1) {
        productList[prodIndex] = { ...productList[prodIndex], ...changes };
        await fs.promises.writeFile(this.path, JSON.stringify(productList));
      }
    } catch (err) {
      console.log(`Error al actualizar el producto por ID: ${err}`);
    }
  }

  async deleteProduct(id) {
    try {
      let productList = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      productList = await productList.filter((prod) => {
        return prod.id !== id;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(productList));
    } catch (err) {
      console.log(`Error al borrar el producto por ID: ${err}`);
    }
  }
}

async function test() {
  const productManager = new ProductManager();

  // Prueba de addProduct
  const newProduct = {
    name: "Nuevo producto",
    price: 90,
    description: "Descripción del nuevo producto"
  };
  await productManager.addProduct(newProduct);
  await productManager.getProducts();

  // Prueba de getProductById
  await productManager.getProductById(1);

  // Prueba de updateProduct
  const updatedFields = {
    name: "Producto actualizado",
    price: 180
  };
  await productManager.updateProduct(1, updatedFields);
  await productManager.getProducts();

/*   // Prueba de deleteProduct
  await productManager.deleteProduct(1);
  await productManager.getProducts(); */
}

/* test(); */