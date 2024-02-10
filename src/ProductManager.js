import fs from 'fs'

export class ProductManager {
    constructor() {
        this.products = [];
        this.idCounter = 0;// agrego variable , cada vez q se genera un id se incrementa en 1 , ademas se verifica el ultimo id
        this.PATH = '../products.json';


    }

    async handleData() { //Obtiene los datos

        try {
            let data = await fs.promises.readFile(this.PATH, 'utf-8');

            if (data) { // Si Existe
                this.products = JSON.parse(data); // guarda los datos en el array products
                const lastProductId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0); //verifica ultimo ID
                this.idCounter = lastProductId; // Actualiza el contador de ID con el último ID utilizado
                return this.products;
            }
        } catch (error) {
            if (error.code === 'ENOENT') { // si el archivo no existe, se crea un archivo vacio
                // con el array vacio
                await fs.promises.writeFile(this.PATH, JSON.stringify(''), null, 2);
                this.products = [];
                return this.products;

            } else {

                console.log("Error al leer los datos del archivo:", error);

            }
        }
    }

    async saveData() { //Guarda los datos nuevos y modificaciones
        try {
            await fs.promises.writeFile(this.PATH, JSON.stringify(this.products), null, 2);
        } catch (error) {
            console.log("Error al guardar los datos en el archivo:", error);
        }
    }

    async addProduct(productData) {
        await this.handleData();

        if (!this.products.some(product => product.code === productData.code)) {// verifica q code no este ya en el array de objetos
            // si es asi se genera un nuevo objeto producto
            const newProduct = {
                id: this.idCounter + 1,
                title: productData.title,
                description: productData.description,
                price: productData.price,
                thumbnail: productData.thumbnail,
                code: productData.code,
                stock: productData.stock,
            };
            this.products.push(newProduct); //se agrega el producto creado al array products
            this.idCounter++;
            await this.saveData(); // funcion encargada de convertir a JSON y guardar el producto creado en el archivo
        } else {
            console.log("El código " + productData.code + " está repetido");// si no se verifica la primera comprovacion devuelve un error
        }
    }

    async getProducts() {// para obtener los productos
        try { // retorna una promesa su es resuelta el array products, si no un error
            await this.handleData();
            return this.products;
        } catch (error) {
            throw new Error("producto no encontrado");
        }
    }

    getProductById(id) {
        const product = this.products.find(product => product.id == id);//Si existe ID se guarda en variabe product
        console.log("🚀 ~ ProductManager ~ getProductById ~ products:", id)
        if (product) {
            return product;
        } else {
            return { error: "El producto no existe" , statusCode: 404 };// si no se encuetra retorna error 
        }                                                               // combierto en objeto y tmb envio un codigo de error
    }

    updateProduct(id, newProductData) {
        const product = this.products.find(product => product.id === id);// Verifica si existe 
        if (product) {                                                   //el producto con ese ID   
            if (newProductData.hasOwnProperty('id')) { // Verifica si newProductData tiene el la propiedad id , si es asi es por q lo q se
                console.log("No se permite modificar el ID del producto.");//intenta modificar es el ID
                return;
            }

            const updatedProduct = {
                ...product,
                ...newProductData
            };
            const index = this.products.indexOf(product);
            this.products[index] = updatedProduct;
            this.saveData();
        } else {
            console.log("No se encontró el producto con el id " + id);
        }
    }

    async deleteProduct(id) {
        await this.handleData(); // Obtiene los datos más recientes

        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0]; // Almacena el producto eliminado
            await this.saveData();

            console.log("Se eliminó el siguiente producto:");
            console.log(deletedProduct); // Muestra la información del producto eliminado

            return deletedProduct; // Devuelve el producto eliminado
        } else {
            console.log("Eliminar : No se encontró el producto con el id " + id);
            return null; // Devuelve null si no se encontró el producto
        }
    }
}


