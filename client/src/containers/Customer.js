import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    Container, Col, Row, 
    Card, CardBody, CardImg, CardTitle, 
    Button, ListGroup, ListGroupItem
  } from 'shards-react'

export default function CustomerProfile() {
    let [itemsForPurchase, setItemsForPurchase] = useState([])
    let [itemData, setItemData] = useState({})
    let [loading, setLoading] = useState(true)
    let [cart, setCart] = useState([])
    let [bank, setBank] = useState(0)

    useEffect(() => {
        async function getItems() {
            const items = await axios.get('/customer/getItems')
            const cart = await axios.get('/customer/getCart')
            const getBank = await axios.get('/customer/getBank')
            let info = {}
            if(items) {
                const html = items.data.map(item => {
                    info[item.name] = {
                        price: item.price,
                        caption: item.caption
                    }
                    return <Col md={3}>
                        <Card>
                            <CardImg style={{ height: '250px' }} src={"data:image/png;base64," + btoa(new Uint8Array(item.image.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))} />
                            <CardBody>
                                <CardTitle> {item.caption} </CardTitle>
                                <ListGroup>
                                    <ListGroupItem><strong>Price: </strong> {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD',})}</ListGroupItem>
                                    <ListGroupItem> {item.inventory > 0 ? 'In Stock' : 'Out of Stock'} </ListGroupItem>
                                </ListGroup>
                                <Button theme="dark" onClick={() => {addToCart(item.name)}}> Add to Cart </Button>
                            </CardBody>
                        </Card>
                    </Col>
                })
                const cartHTML = cart.data.map(c => {
                    return cartDisplay(c)
                })
                setBank(getBank.data)
                setCart(cartHTML)
                setItemData(info)
                setItemsForPurchase(html)
            }
            setLoading(false)
        }

        async function addToCart(name) {
            // console.log(itemData, itemData[name])
            let response = await axios.post('/customer/addToCart', {
                name: name, 
                price: itemData[name].price, 
                caption: itemData[name].caption
            })
            if(response.data) {
                const cart = await axios.get('/customer/getCart')
                const cartHTML = cart.data.map(c => {
                    return cartDisplay(c)
                })
                setCart(cartHTML)
            }
        }

        getItems()
    }, [itemData, cart])

    function cartDisplay(c) {
        return <Col md={3}>
                <ListGroup>
                    <ListGroupItem>{c.caption}</ListGroupItem>
                    <ListGroupItem><strong>Price: </strong> {c.price.toLocaleString('en-US', { style: 'currency', currency: 'USD',})}</ListGroupItem>
                    <ListGroupItem><strong>Amount: </strong> {c.amount}</ListGroupItem>
                </ListGroup>
            </Col>
    }

    async function pay() {
        const response = await axios.post('/customer/pay')
        if(response.data) {
            const getBank = await axios.get('/customer/getBank')
            setBank(getBank)
            setCart([])
            alert('You have paid!')
        }
    }

    return (
        <>
            <br />
            <h4>Customer: These are the photos available to purchase</h4>
            <Container>
                <br/><br/>
                <Row>
                    {loading ? <p> Loading Items 🔃 </p> : itemsForPurchase}
                </Row>
            </Container>
            <br/><br/>
            <Container>
                <h4>Your Cart</h4>
                <Row>
                    {cart}
                </Row>
                <br/>
                <Button onClick={pay}>Pay</Button>
            </Container>
            <br/><br/>
            <h4>Your Bank: {bank.toLocaleString('en-US', { style: 'currency', currency: 'USD',})}</h4>
            <br/><br/>
        </>
    );
}
  