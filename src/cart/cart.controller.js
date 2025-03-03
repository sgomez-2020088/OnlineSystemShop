import Cart from './cart.model.js'



export const addCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const userId = req.user.id

        const product = req.product

        let cart = await Cart.findOne({ user: userId })
        if (!cart) cart = new Cart({ user: userId, products: [] })
        

        const existProduct = cart.products.findIndex(
            (item) => item.product.toString() === productId
        )

        if (existProduct !== -1) {
        cart.products[existProduct] = {
            product: productId,
            quantity,
            price: product.price
        }} else {
        cart.products.push({
            product: productId,
            quantity,
            price: product.price
        })
        }

        cart.total = cart.products.reduce(
        (total, item) => total + item.price * item.quantity,0)

        await cart.save()

        cart = await Cart.findOne({ user: userId })
        .populate('products.product', 'name description')
        .populate('user', 'name email -_id')

        return res.status(200).send({
        message: 'Cart updated successfully',
        success: true,
        cart
        })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}




export const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const userId = req.user.id

        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found', success: false })
        }

        const productIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        )

        if (productIndex === -1) {
            return res.status(404).send({ message: 'Product not in cart', success: false })
        }

        if (quantity <= 0) {
            cart.products.splice(productIndex, 1)
        } else {
            cart.products[productIndex].quantity = quantity
        }

        cart.total = cart.products.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )

        await cart.save()

        cart = await Cart.findOne({ user: userId })
            .populate('products.product', 'name description')
            .populate('user', 'name email -_id')

        return res.status(200).send({
            message: 'Cart updated successfully',
            success: true,
            cart
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}