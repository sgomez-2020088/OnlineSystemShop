'use strict'
import Product from './product.model.js'

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

