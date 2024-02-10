import { ProductManager } from "./ProductManager.js";

import express from "express";

const app = express();
const port = 8080;


app.use(express.urlencoded({ extended: true }))

app.listen(port, () => console.log("Servidor corriendo en el puerto", port))

const productManager = new ProductManager()

app.get("/products", async ({ query }, res) => {

    try {
        const { limit } = query;
        let products = await productManager.getProducts();

        if (limit) {
            products = products.slice(0, parseInt(limit));
        }
        res.json(products)
    } catch (error) {
        console.error("Error al obtener los productos", error);
        res.status(500).send("Erro al obttener los productos");
    }
});

app.get("/products/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productManager.getProductById(pid);
  
      console.log("Producto solicitado:", product);
      res.json(product);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res.status(500).send("Error al obtener el producto");
    }
  });
