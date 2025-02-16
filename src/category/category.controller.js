import Category from '../category/category.model.js'
import Product from '../product/product.model.js'

export const addCategory = async (req, res) =>{
    try {
        const {name, description} = req.body
        const category = new Category({ name, description })
        await category.save()

        return res.send({message: 'Category added successfully', success: true,category})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error'})
    }
}

export const getAll = async (req, res) =>{
    try {
        
        const categories = await Category.find()
        if(categories.length === 0) return res.status(400).send({message: 'Categories not found', success: false})
            return res.send({message: 'Categories found', success: true, categories})
    } catch (err) {
        console.error(err)
        res.status(500).send({message: 'general error'})
    }    
}

export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.body.id 
        const  data = req.body

        const updateCategory = await Category.findByIdAndUpdate(categoryId, data, {new:true})
        if(!updateCategory) return res.status(404).send({message: 'Category not found', success: false})
            return res.send({message: 'Category updated succesfully', category: updateCategory, success: true})

    } catch (err) {
        console.error(err)
        res.status(500).send({message: 'General error', success: false})
    }
}


export const deleteCategory = async (req, res) => {
    try {
        const  id  = req.body.id

        const deletedCategory = await Category.findById(id)
        if (!deletedCategory) return res.status(404).send({ message: 'Category not found', success: false })
            await Category.findByIdAndDelete(id)

        let defaultCategory = await Category.findOne({ name: 'Uncategorized' })
        if (!defaultCategory) {
            defaultCategory = new Category({ name: 'Uncategorized', description: 'Default category' })
            await defaultCategory.save()
        }

        await Product.updateMany(
            { category: id },  
            { $set: 
                { 
                    category: defaultCategory._id 
                } 
            } 
        )

        return res.send({ message: 'Category deleted successfully, products reassigned ', success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}

