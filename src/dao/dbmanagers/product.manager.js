import { productModel } from "../models/product.model.js";

class ProductManager {
  constructor() {
    this.model = productModel;
  }

  async getProducts(
    limit = 10,
    page = 1,
    category = false,
    status = false,
    sort = false
  ) {
    let filter = {};
    let labels = {
      docs: "payload",
      totalDocs: false,
    };
    let options = { lean: true, page, limit, sort, customLabels: labels };

    if (category) {
      filter = { ...filter, category };
    }
    if (status) {
      filter = { ...filter, status };
    }

    if (sort === "asc") {
      options.sort = { price: 1 };
    }
    if (sort === "desc") {
      options.sort = { price: -1 };
    }

    return await this.model.paginate(filter, options);
  }

  async getProductById(pid) {
    return await this.model.findById(pid).lean();
  }

  async addProduct(product) {
    return await this.model.create(product);
  }

  async updateProduct(pid, product) {
    return await this.model.findByIdAndUpdate(
      pid,
      { $set: product },
      { new: true }
    );
  }

  async deleteProduct(pid) {
    return await this.model.findByIdAndDelete(pid);
  }
}

const productManager = new ProductManager();

export default productManager;