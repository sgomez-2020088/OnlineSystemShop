import Cart from '../cart/cart.model.js'
import Bill from '../bill/bill.model.js'
import Product from '../product/product.model.js'

export const generateBill = async (req, res) => {
    try {
        const userId = req.user.id
        const { cart, subTotal, total } = req.billingData

        const bill = new Bill({
            user: userId,
            cart: cart._id,
            products: cart.products.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.price
            }))
        })

        await bill.save()
        await Cart.findByIdAndDelete(cart._id)

        const populatedBill = await Bill.findById(bill._id)
        .populate('products.product', 'name description price')
        .populate('user', 'name email')

        return res.status(200).send({
        message: 'Bill created successfully',
        success: true,
        bill: {
            //spread
            ...populatedBill.toJSON(),
            subTotal: subTotal.toFixed(2),
            total: total.toFixed(2)
        }
    })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}

export const getUserBill = (req, res) => {
    return res.send({
    message: 'Bills found successfully',
    success: true,
    bills: req.formattedBills
    })
}

export const updateBill = async (req, res) => {
    try {
        const { billId } = req.body  
        const { products } = req.body  


        if (!products || !Array.isArray(products)) return res.status(400).send({ message: 'Products array is required', success: false })
        
        const bill = await Bill.findById(billId).populate('products.product')

        if (!bill) return res.status(404).send({ message: 'Bill not found', success: false })
        
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]

            const product = await Product.findById(productId)

            if (!product) return res.status(404).send({ message: `Product ${productId} not found`, success: false })
            
            if (product.stock < quantity) {
                return res.status(400).send({
                    message: `Not enough stock for product ${product.name}. Only ${product.stock} available.`,
                    success: false
                })
            }
        }

        bill.products = products.map(item => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.price  
        }))


        const subTotal = bill.products.reduce((total, item) => total + item.price * item.quantity, 0)
        const total = subTotal * 1.12

        bill.subTotal = subTotal.toFixed(2)
        bill.total = total.toFixed(2)

        bill.status = 'paid'
        await bill.save()

        const updatedBill = await Bill.findById(billId)
            .populate('products.product', 'name description price')
            .populate('user', 'name email -_id ')

        return res.status(200).send({
            message: 'Bill updated successfully',
            success: true,
            bill: updatedBill,
            subTotal: bill.subTotal,
            total: (bill.total)
        })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}

export const getHistoryUser = (req, res) => {
    return res.send({
        message: 'Bills retrieved successfully',
        success: true,
        bills: req.formattedBills
    })
}