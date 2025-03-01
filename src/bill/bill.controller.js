import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'
import Bill from '../bill/bill.model.js'


/*El problema ocurre porque al momento de guardar la factura, solo estamos almacenando el ObjectId del producto en products.product.
Cuando respondemos con la factura creada, no hemos poblado esos ObjectId con los detalles del producto.
*/
export const generateBill = async (req, res) => {
    try {
        const userId = req.user.id
        const cart = await Cart.findOne({ user: userId })
            .populate('user', 'name email -_id')
            .populate({
                path: 'produts.product',
                select: 'name price description -_id'
            })

        if (!cart || cart.produts.length === 0) return res.status(400).send({ message: 'Cart is empty', success: false })
        
        let total = cart.produts.reduce((sum, item) => sum + (item.totalCart || 0), 0)

        const iva = total * 0.12
        const grandTotal = total + iva

        const billProducts = cart.produts.map(item => ({
            product: {
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                description: item.product.description
            },
            quantity: item.quantity,
            totalCart: item.totalCart
        }))

        const bill = new Bill({
            user: userId,
            cart: cart._id,
            products: billProducts,
            total: grandTotal
        })

        await bill.save()
        await Cart.findByIdAndDelete(cart._id)

        return res.json({
            message: 'Purchase completed successfully, bill created, and cart reset',
            bill, 
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

        const bills = await Bill.find({ user: userId })
            .populate('user', 'name email -_id') 
            .sort({ createdAt: -1 }) 

        if (!bills.length) return res.status(404).send({ message: 'bills not founded for this user', success: false })

        const formattedBills = bills.map(bill => ({
            billId: bill._id,
            user: bill.user,
            createdAt: bill.createdAt,

            products: bill.products.map(item => ({
                id: item.product._id,
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                quantity: item.quantity,
                totalCart: item.totalCart
            })),
        
            total: bill.total.toFixed(2)
        }))

        return res.send({
            message: 'Bills retrieved successfully',
            bills: formattedBills,
            success: true
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}

export const updateBill = async (req, res) => {
    try {
        const { billId, products } = req.body 
        
        const bill = await Bill.findById(billId)

        if (!bill) return res.status(404).json({ message: 'Bill not found', success: false })
        
        let total = 0
        for (const item of products) {
            const product = await Product.findById(item.product)

            if (!product) return res.status(404).send({ message: `Product not found: ${item.product}`, success: false })
            
            if (product.stock < item.quantity) {
                return res.status(400).send({
                    message: `Not enough stock for ${product.name} (Available: ${product.stock})`,
                    success: false
                })
            }

            total += product.price * item.quantity

            product.stock -= item.quantity
            await product.save()
        }

        bill.products = products
        bill.total = total

        await bill.save()

        return res.send({
            message: 'Bill updated successfully',
            bill,
            success: true
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}

