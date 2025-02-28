import Product from '../src/product/product.model.js'
import Cart from '../src/cart/cart.model.js'

/*
export const checkStock = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { productId, quantity } = req.body

        const product = await Product.findById(productId)
        if (!product) return res.status(404).send({ message: 'Product not found', success: false })

        if (product.stock < quantity) return res.status(400).send({ message: `Not enough stock ${product.name}`, success: false })
        
        let cart = await Cart.findOne({ user: userId })
        if (!cart) cart = new Cart({ user: userId, produts: [] })

        const productExists = cart.produts.some(p => p.product.toString() === productId)
        if (productExists) return res.status(400).send({ message: 'Product is already in the cart', success: false })
        
        product.stock -= quantity
        await product.save() 

        req.cart = cart 
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error checking stock', success: false })
    }
}*/

export const checkStock = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { productId, quantity } = req.body

        const product = await Product.findById(productId)
        if (!product) return res.status(404).send({ message: 'Product not found', success: false })

        let cart = await Cart.findOne({ user: userId })
        if (!cart) cart = new Cart({ user: userId, produts: [] })

        const productAdded = cart.produts.findIndex(p => p.product.toString() === productId)

        if (productAdded !== -1) {
            if (quantity > product.stock) return res.status(400).send({ message: `Cannot add more than available stock (${product.stock})`, success: false })
            

            cart.produts[productAdded].quantity = quantity
            cart.produts[productAdded].totalCart = product.price * quantity 
        } else {
            if (quantity > product.stock) return res.status(400).send({ message: `Not enough stock for ${product.name}`, success: false })
    
            cart.produts.push({ product: productId, quantity, totalCart: product.price * quantity })
        }

        await cart.save()
        req.cart = cart
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error checking stock', success: false })
    }
}