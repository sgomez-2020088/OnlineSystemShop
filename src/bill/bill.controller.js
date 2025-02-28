import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'
import Bill from '../bill/bill.model.js'

/*
export const generateBill = async (req, res) => {
    try {
        const userId = req.user.id

        // Obtener el carrito del usuario con los productos
        const cart = await Cart.findOne({ user: userId })
            .populate('user', 'name username -_id')
            .populate('produts.product', 'name price description stock -_id')

        if (!cart || cart.produts.length === 0) {
            return res.status(400).json({ message: 'Cart is empty', success: false })
        }

        // Calcular el total sumando los totalCart de cada producto
        let total = cart.produts.reduce((sum, item) => sum + (item.totalCart || 0), 0)

        // Calcular IVA (12%)
        const iva = total * 0.12
        const grandTotal = total + iva

        // Actualizar el stock de los productos en el carrito
        for (const item of cart.produts) {
            const product = await Product.findById(item.product._id)

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product.name}`, success: false })
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Not enough stock for ${item.product.name} (Available: ${product.stock})`, 
                    success: false 
                })
            }

            // Restar del stock
            product.stock -= item.quantity
            await product.save()
        }

        // Crear la factura con el total calculado
        const bill = new Bill({
            user: userId,
            cart: cart._id, // Asociamos la factura con el carrito
            total: grandTotal // Total con IVA incluido
        })

        await bill.save()

        return res.json({
            cart,
            message: 'Purchase completed successfully, bill created, and stock updated',
            bill: {
                iva: parseFloat(iva.toFixed(2)),
                total: grandTotal
            },
            success: true
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'General error', success: false })
    }
}*/

export const generateBill = async (req, res) => {
    try {
        const userId = req.user.id
        

        const cart = await Cart.findOne({ user: userId })
            .populate('user', 'name username -_id')
            .populate('produts.product', 'name price description stock')

        if (!cart || cart.produts.length === 0) return res.status(400).json({ message: 'Cart is empty', success: false })
        
        let total = cart.produts.reduce((sum, item) => sum + (item.totalCart || 0), 0)

        for (const item of cart.produts) {
            const product = await Product.findById(item.product._id)

            if (!product) return res.status(404).json({ message: `Product not found: ${item.product.name}`, success: false })

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Not enough stock for ${item.product.name} (Available: ${product.stock})`, 
                    success: false 
                })
            }

            product.stock -= item.quantity
            await product.save()
        }
        const iva = total * 0.12
        const grandTotal = total + iva

        const bill = new Bill({
            user: userId,
            cart: cart._id, 
            total: grandTotal 
        })

        await bill.save()

        return res.send({
            cart,
            message: 'Purchase completed successfully',
            bill: {
                iva: parseFloat(iva.toFixed(2)),
                total: grandTotal
            },
            success: true
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}


export const getUserBills = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required', success: false })
        }

        const bills = await Bill.find({ user: userId }).populate('cart')

        if (!bills.length) return res.status(404).json({ message: 'No bills found for this user', success: false })
        

        return res.json({
            message: 'Bills retrieved successfully',
            bills,
            success: true
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}
