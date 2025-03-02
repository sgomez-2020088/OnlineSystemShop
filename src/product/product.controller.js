'use strict'
import Product from './product.model.js'
import Bill from '../bill/bill.model.js'

export const addProduct = async (req, res) =>{
    try {
        const data = req.body
        const product = new Product(data)
        await product.save()

        return res.send({message: 'Product added successfully', succes: true})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error'})
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({
            status: {$ne : false},
            stock: { $ne: 0}

        }).populate('category', 'name -_id')
        if(products.length === 0) return res.status(400).send({message: 'Products not found', succes: false})
            return res.send({message: 'Products found',products, succes: true})
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: 'General error', succes: false })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findById(id).populate('category', 'name')
        if (!product) return res.status(404).send({ message: 'Product not found', succes: false })
        res.json(product)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error' })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const productId = req.body.id
        const data = req.body

        const updateProduct = await Product.findByIdAndUpdate(productId, data, {new: true}).populate('category', 'name')
        if(!updateProduct) return res.status(404).send({message:'Product not found', success: false})
            return res.send({message: 'Product updated succesfully ', product: updateProduct, success: true})

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false})
    }
}



export const deleteProduct = async (req, res) => {
    try {
        const id = req.body.id
    
        const deletedProduct = await Product.findByIdAndUpdate(id, {status: false})
        if (!deletedProduct) return res.status(404).send({message:'Product not found', success: false})

        return res.send({ message: 'Product deleted successfully', success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error', success: false})
    }
}


export const getOutOfStock = async (req, res) => {
    try {
        const outOfStock = await Product.find({ stock: 0 })
        if(outOfStock.length === 0) return res.send({message:'No one out of stock'})
            return res.send(outOfStock)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false})
    }
}

export const productByName = async (req, res) => {
    try {
        const name = req.body.name
        
        const products = await Product.find({
            name: { $regex: name, $options: 'i' }, 
            status: { $ne: false },
            stock: { $gt: 0 }
        }).populate('category', 'name')
        if (products.length === 0) return res.status(404).send({ message: 'No products found', success: false })

            return res.send({ message: 'Products found', products, success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error', success: false})
    }
}

export const productByCategory = async (req, res) =>{
    try {
        const category = req.body.category
        const products = await Product.find({
            category: category,
            status: { $ne: false },
            stock: { $gt: 0 }
        }).populate('category', 'name')

        if(products.length === 0) return res.status(404).send({message: 'No products found', success: false})

            return res.send({message: 'Products found', products, success: true})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error', success: false})
    }
}

export const getTopSellingProducts = async (req, res) => {
    try {
        // Obtenemos las facturas y poblamos el campo "produts.product" (ya que "produts" existe en tu modelo de factura o carrito)
        const bills = await Bill.find()
            .populate({
                path: 'produts.product',  // Referencia al campo "produts.product"
                select: 'name price description -_id'
            });

        if (bills.length === 0) {
            return res.status(404).json({ message: 'No bills found', success: false });
        }

        // Crear el objeto para contar las cantidades vendidas
        const productSales = {};

        // Recorrer todas las facturas y contar las ventas de cada producto
        bills.forEach(bill => {
            bill.produts.forEach(item => {
                const productId = item.product._id.toString();

                // Si el producto ya está en el objeto, sumamos la cantidad
                if (productSales[productId]) {
                    productSales[productId].quantity += item.quantity;
                } else {
                    // Si no está en el objeto, lo agregamos
                    productSales[productId] = {
                        product: item.product,
                        quantity: item.quantity
                    };
                }
            });
        });

        // Convertimos el objeto en un array
        const productArray = Object.values(productSales);

        // Ordenamos los productos por la cantidad vendida
        productArray.sort((a, b) => b.quantity - a.quantity);

        // Devolvemos los productos más vendidos
        return res.json({
            message: 'Top-selling products retrieved successfully',
            products: productArray,
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving products', success: false });
    }
};