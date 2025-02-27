import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'

export const addCart = async (req, res) => {
    try {
        const cart = req.cart

        await cart.save()

        const populatedCart = await Cart.findById(cart._id)
            .populate('produts.product', 'name price description -_id')
            .populate('user', 'name email -_id')

        return res.send({ message: 'Product added to cart', cart: populatedCart, success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}




export const getCart = async (req, res) => {
    try {
        const userId = req.user.id
        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'produts.product',
                select: 'name price description -_id',
                populate: {
                    path: 'category',
                    select: 'name description -_id' 
                }
            })
            .populate({
                path: 'user',
                select: 'name email -_id' 
            })
        
        if (!cart || cart.produts.length === 0) {
            return res.status(404).send({ message: 'Cart is empty', success: false })
        }

        return res.send({ message: 'All is right', cart, success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}
