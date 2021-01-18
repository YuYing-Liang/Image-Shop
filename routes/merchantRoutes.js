module.exports = (app) => {
    const Merchant = require('../models/Merchant')
    const Bank = require('../models/Bank')
    const multer = require('multer')
    const upload = multer()

    app.post('/merchant/uploadItems', upload.array('images', 10), async (req, res) => {
        let photos = req.files

        console.log(photos)

        if(photos){
            photos.forEach( async (p) => {
                const newItem = new Merchant({
                    name: p.originalname,
                    image: p.buffer,
                    caption: '',
                    price: 0,
                    inventory: 0,
                    isPublic: false
                })

                await newItem.save()

                console.log('item saved!')
                
            });
        }

        res.redirect('/')
        return
    })

    app.get('/merchant/getItems', async(req, res) => {
        const allItems = await Merchant.find()
        res.send(allItems) 
    })

    app.post('/merchant/editItem', (req, res) => {
        const updatedVals = req.body

        updatedVals.forEach(val => {
            Merchant.findOne({ name: val.name }).then((item) => {
                item.caption = val.caption
                item.price = val.price
                item.inventory = val.inventory
                item.isPublic = val.isPublic
                item.save()
                console.log('edited item ' + val.name)
            })
        })
        res.send(true)
        return
    })

    app.get('/merchant/getBank', async(req, res) => {
        Bank.findOne({ type: 'merchant'}).then((acct) => {
            if(acct) {
                res.send(acct.amount.toString())
            }else{
                res.send("0")
            }
        })
    })

}