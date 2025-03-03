import Product from '../src/product/product.model.js'
import Cart from '../src/cart/cart.model.js'
import Bill from '../src/bill/bill.model.js'

export const verifyStock = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body
        const product = await Product.findById(productId)
    
        if (!product) return res.status(404).send({ message: 'Product not found', success: false })
    
        if (product.stock < quantity) return res.status(400).send({ message: 'Not enough stock', success: false })
        product.countSell += quantity
        await product.save()

    req.product = product

        next()
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'General error in updating product sales', success: false })
    }
}

export const billData = async (req, res, next) => {
    try {
    const userId = req.user.id
    
    const cart = await Cart.findOne({ user: userId }).populate('products.product')
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found', success: false })
        }
    
        const subTotal = cart.products.reduce((total, item) => total + item.price * item.quantity, 0)
        const total = subTotal * 1.12

            req.billingData = { cart, subTotal, total }
            next()
        } catch (error) {
            console.error(error)
            return res.status(500).send({ message: 'General error', success: false })
    }
}

export const updateStock = async (req, res, next) => {
    try {
        const { cart } = req.billingData
    
        for (const item of cart.products) {
        const product = await Product.findById(item.product._id)
        if (product) {
        product.stock -= item.quantity
        await product.save()
        }
        }
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'General error', success: false })
        }
    }

    export const UserBills = async (req, res, next) => {
        try {
            const { userId } = req.body
    
            const bills = await Bill.find({ user: userId })
            .populate('user', 'name email -_id')
            .populate('products.product', 'name description price')
            .sort({ createdAt: -1 })
    
            if (!bills.length)
            return res.status(404).send({ message: 'No Bills found for this user', success: false })
    
            req.bills = bills
            next()
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: 'General error', success: false })
        }
    }

    export const formatUserBill = (req, res, next) => {
        try {
            const bills = req.bills
    
            const formattedBills = bills.map(bill => {
                const subTotal = bill.products.reduce((total, item) => total + item.price * item.quantity,0)
            const total = subTotal * 1.12
    
            const formattedProducts = bill.products.map(item => ({
                id: item.product._id,
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                quantity: item.quantity,
              totalCart: (item.price * item.quantity).toFixed(2)
            }))
    
            return {
                billId: bill._id,
                user: bill.user,
                createdAt: bill.createdAt,
                products: formattedProducts,
                subTotal: subTotal.toFixed(2),
                total: total.toFixed(2)
            }
        })
    
            req.formattedBills = formattedBills
            next()
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: 'General error', success: false })
        }
    }

    export const userHistoryBill = async (req, res, next) => {
        try {

            
            const userId = req.user.id

            const {limit = 20 , skip = 0} = req.query
            const bills = await Bill.find({ user: userId })
            .populate('user', 'name email -_id')
            .populate('products.product', 'name description price')
            .sort({ createdAt: -1 })
            .skip (skip)
            .limit(limit)
            if (!bills.length) return res.status(404).send({ message: 'No Bills found for this user', success: false })
            
            req.bills = bills
            next()
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: 'General error', success: false })
        }
    }

    export const formatHistoryBill = (req, res, next) => {
        try {
            const formattedBills = req.bills.map(bill => {
            const subTotal = bill.products.reduce((total, item) => total + item.price * item.quantity, 0)
            const total = subTotal * 1.12
    
            return {
                billId: bill._id,
                user: bill.user,
                createdAt: bill.createdAt,

                products: bill.products.map(item => ({
                id: item.product._id,
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                quantity: item.quantity,
                totalCart: (item.price * item.quantity).toFixed(2)
                })),
                subTotal: subTotal.toFixed(2),
                total: total.toFixed(2)
            }
        })
    
            req.formattedBills = formattedBills
            next()
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: 'General error', success: false })
        }
    }