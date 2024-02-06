const fs = require('fs');

class ProductManager {
    constructor(filepath = '../productos.json') {
        this.path = filepath;
        this.currentId = 1;

        if (fs.existsSync(filepath)) {
            const fileContent = fs.readFileSync(filepath, 'utf-8');
            this.products = JSON.parse(fileContent);

            if (this.products.length > 0) {
                this.currentId = Math.max(...this.products.map(p => p.id)) + 1;
            }
        } else {
            this.products = [];
            fs.writeFileSync(filepath, '[]', 'utf-8');
        }
    }

    saveToFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    addProduct(productData) {
        const newProductId = this.currentId++;

        if (this.products.some(product => product.code === productData.code)) {
            throw new Error('Este code ya existe en otro producto.');
        }

        const newProduct = {
            id: newProductId,
            ...productData,
        };

        this.products.push(newProduct);
        this.saveToFile();

        return newProduct;
    }

    getProducts() {
        const fileContent = fs.readFileSync(this.path, 'utf-8');
        return JSON.parse(fileContent);
    }

    getProductById(productId) {
        const allProducts = this.getProducts();
        return allProducts.find(product => product.id === productId);
    }

    updateProduct(productId, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === productId);

        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updatedFields,
                id: productId,
            };

            this.saveToFile();
            return true;
        }

        return false;
    }

    deleteProduct(productId) {
        const initialLength = this.products.length;
        this.products = this.products.filter(product => product.id !== productId);

        if (this.products.length !== initialLength) {
            this.saveToFile();
            return true;
        }

        return false;
    }
}

const productManager = new ProductManager('../productos.json');

// Caso de prueba
try {
    productManager.addProduct({
        title: 'PC gamer',
        description: 'PC gamer, 32gb RAM, Nvidia 3080 GTX, Intel i9 11th',
        price: 2500000,
        thumbnail: 'pc.jpg',
        code: 'P008',
        stock: 10,
    });

    productManager.addProduct({
        title: 'Playstation 4',
        description: 'Playstation 4 con the last of us y spider-man',
        price: 750000,
        thumbnail: 'ps4.jpg',
        code: 'P009',
        stock: 10,
    });

    // Actualizar un producto por ID
    const updatedFields = {
        price: 70000,
        code: 'P080',
        stock: 5,
    };

    const update = productManager.updateProduct(4, updatedFields);

    if (update) {
        console.log('Producto actualizado con éxito');
    } else {
        console.log('No se encontró el producto con el ID especificado');
    }

    // Eliminar un producto por ID
    const success = productManager.deleteProduct(1);

    if (success) {
        console.log('Producto eliminado con éxito');
    } else {
        console.log('No se encontró el producto con el ID especificado');
    }

    console.log(productManager.getProducts());
} catch (error) {
    console.error(error.message);
}