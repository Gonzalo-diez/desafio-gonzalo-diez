const express = require("express");
const fs = require("fs").promises;

const app = express();

// Definir endpoint para obtener productos
app.get("/products", async (req, res) => {
    try {
        // Leer el archivo productos.json
        const productsData = await fs.readFile("../productos.json", "utf-8");
        const products = JSON.parse(productsData);

        // Obtener el parámetro de consulta de límite (si existe)
        const limit = parseInt(req.query.limit);

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
        // Leer el archivo productos.json
        const productsData = await fs.readFile("../productos.json", "utf-8");
        const products = JSON.parse(productsData);

        // Obtener el ID del producto de los parámetros de ruta
        const productId = parseInt(req.params.pid);

        // Buscar el producto por ID
        const product = products.find(product => product.id === productId);

        // Verificar si se encontró el producto
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
