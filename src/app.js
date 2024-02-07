import express from "express";
import ProductManager from "./productManager.js";

const app = express();
const productManager = new ProductManager();

// Definir endpoint de bienvenida
app.get("/", (req, res) => {
    res.json({
        message1: "Bienvenido usuario!!",
        message2: "Si quiere ver los productos vaya a /products.",
        message3: "Si quiere ver por cierto límite vaya a /products/?limit=numero.",
        message4: "Si quiere ver el producto según el ID, vaya a /products/:pid o número de ID."
    });
});

// Definir endpoint para obtener productos
app.get("/products", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = productManager.getProducts(); // Obtener productos del productManager

        // Filtrar productos según el límite
        const limitedProducts = limit ? products.slice(0, limit) : products;

        // Enviar la respuesta con los productos filtrados
        res.json(limitedProducts);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// Definir endpoint para obtener un producto por ID
app.get("/products/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = productManager.getProductById(productId); // Obtener producto por ID del productManager

        if (product) {
            // Enviar la respuesta con el producto encontrado
            res.json(product);
        } else {
            // Enviar respuesta de error si no se encuentra el producto
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener producto" });
    }
});

app.listen(8080, () => console.log("Servidor conectado!!"));