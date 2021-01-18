module.exports = (app) => {
    const Merchant = require('../models/Merchant')
    const Bank = require('../models/Bank')
    const CustomerCart = require('../models/CustomerCart')

    app.get('/customer/getItems', async(req, res) => {
        const allItems = await Merchant.find()
        let publicItems = []
    
        allItems.forEach(item => {
            if(item.isPublic) publicItems.push(item)
        })
        
        res.send(publicItems)
    })

    app.post('/customer/addToCart', async(req,res) => {
        const newItem = req.body
        CustomerCart.findOne({ name: newItem.name }).then((item) => {
            if(item){
                item.amount = item.amount + 1         
                item.save()
            }else{
                const newCartItem = new CustomerCart({
                    name: newItem['name'],
                    caption: newItem['caption'],
                    price: newItem['price'],
                    amount: 1
                })
                newCartItem.save()
            }
            console.log('cart updated!')
            res.send(true)
        })
    })

    app.get('/customer/getCart', async(req,res) => {
        const cart = await CustomerCart.find()
        res.send(cart)
    })

    app.get('/customer/getBank', async(req, res) => {
        let all = await Bank.find()
        // console.log('bank:', all)
        Bank.findOne({ type: 'customer'}).then((acct) => {
            if(acct) {
                res.send(acct.amount.toString())
            }else{
                res.send("0")
            }
        })
    })

    app.post('/customer/pay', async(req, res) => {
        const cart = await CustomerCart.find()
        let total = 0

        cart.forEach(item => {
            total += item.amount * item.price
            Merchant.findOne({ name: item.name }).then((photo) => {
                photo.inventory = photo.inventory - item.amount       
                photo.save()
            })
        })
        await CustomerCart.remove({})
        console.log('inventory updated!')

        Bank.findOne({ type: 'customer'}).then((acct) => {
            if(acct) {
                acct.amount = acct.amount - total
                acct.save()
            }
        })

        Bank.findOne({ type: 'merchant'}).then((acct) => {
            if(acct) {
                acct.amount = acct.amount + total
                acct.save()
            }
        })

        res.send(true)
    })
}