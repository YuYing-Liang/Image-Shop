import React, { useCallback, useEffect, useState } from 'react'
import {
  Container, Col, Row,
  Card, CardBody, CardImg, CardTitle,
  Button, ListGroup, ListGroupItem,
  InputGroup, InputGroupText, InputGroupAddon, FormInput
} from 'shards-react'
import axios from 'axios';

export default function MerchantProfile(props) {

  let [items, setItems] = useState(null)
  let [itemData, setItemData] = useState([])
  let [newItems, setNewItems] = useState(<div />)
  let [loading, setLoading] = useState(true)
  let [newItemNames, setNewItemNames] = useState([])
  let [bank, setBank] = useState(0)

  const refresh = useCallback(async () => {
    const allItems = await axios.get('/merchant/getItems')
    setLoading(true)
    if (allItems.data.length > 0) {
      let htmlItems = [], incompleteItems = [], newNames = []
      allItems.data.forEach(item => {
        if (item.caption) {
          htmlItems.push(imageHTML(item))
        } else {
          newNames.push(item.name)
          const index = incompleteItems.length
          incompleteItems.push(editHTML(item, index))
        }
      })
      setNewItems(incompleteItems)
      setNewItemNames(newNames)
      setItems(htmlItems)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    async function getItems() {
      const allItems = await axios.get('/merchant/getItems')
      const getBank = await axios.get('/merchant/getBank')
      if (allItems.data.length > 0) {
        let htmlItems = [], incompleteItems = [], newNames = []
        allItems.data.forEach(item => {
          if (item.caption) {
            htmlItems.push(imageHTML(item))
          } else {
            newNames.push(item.name)
            const index = incompleteItems.length
            incompleteItems.push(editHTML(item, index))
          }
        })
        setBank(getBank.data)
        setItemData(allItems.data)
        setNewItems(incompleteItems)
        setNewItemNames(newNames)
        setItems(htmlItems)
      }
      setLoading(false)
    }
    getItems()
  }, [])

  async function editPhotoData() {
    let updatedData = []
    for (let i = 0; i < newItems.length; i++) {
      updatedData.push({
        name: newItemNames[i],
        price: parseFloat(document.getElementById('price ' + i).value),
        inventory: parseInt(document.getElementById('inventory ' + i).value),
        caption: document.getElementById('caption ' + i).value,
        isPublic: document.getElementById('isPublic ' + i).checked
      })
    }
    let response = await axios.post('/merchant/editItem', updatedData)
    setNewItemNames([])
    setNewItems(<div />)

    if(response.data) {
      setLoading(true)
      const allItems = await axios.get('/merchant/getItems')
      if (allItems.data.length > 0) {
        const htmlItems = allItems.data.forEach(item => {
            return imageHTML(item)
        })
        setItems(htmlItems)
      }
      setLoading(false)
    }
    console.log('finished')
  }


  function imageHTML(item) {
    return <Col md={3}>
      <Card>
        <CardImg style={{ height: '250px' }} src={"data:image/png;base64," + btoa(new Uint8Array(item.image.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))} />
        <CardBody>
          <CardTitle> {item.caption} </CardTitle>
          <ListGroup>
            <ListGroupItem><strong>Price: </strong> {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD',})}</ListGroupItem>
            <ListGroupItem><strong>Inventory: </strong> {item.inventory}</ListGroupItem>
            <ListGroupItem>{item.isPublic ? 'Public' : 'Not Public'}</ListGroupItem>
          </ListGroup>
        </CardBody>
      </Card>
    </Col>
  }

  function editHTML(item, index) {
    return <Col md={3}>
      <Card>
        <CardImg style={{ height: '200px' }} src={"data:image/png;base64," + btoa(new Uint8Array(item.image.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))} />
        <CardBody>
          <InputGroup>
            <InputGroupAddon type="prepend">
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <FormInput placeholder="Price" id={"price " + index} />
          </InputGroup>
          <FormInput placeholder="Inventory Amount" id={"inventory " + index} />
          <FormInput placeholder="Caption" id={"caption " + index} />
          <input type="checkbox" id={"isPublic " + index} /> <label> Make Public </label>
        </CardBody>
      </Card>
    </Col>
  }

  function editItem() {
    let newNames = []
    const incompleteItems = itemData.map((item, index) => {
      newNames.push(item.name)
      return editHTML(item, index)
    })
    setNewItems(incompleteItems)
    setNewItemNames(newNames)
  }

  return (
    <>
      <br />
      <h4>Merchant: This is your gallery, add items to display</h4>
      <form action="/merchant/uploadItems" enctype="multipart/form-data" method="POST">
        Select images: <input type="file" name="images" multiple />
        <input className="button button-primary" type="submit" value="Upload your files" />
      </form>
      <Button onClick={refresh} theme="secondary">Refresh</Button>
      <Container>
        <br /><br />
        {newItemNames.length > 0 && <h6>Please fill in the details of your new photos</h6>}
        <Row>
          {(items === null && !loading) && <h6>Your gallery is empty, upload files to fill it up!</h6>}
          {loading ? <p> Loading Items 🔃 </p> : (newItemNames.length > 0) ? newItems : items}
        </Row>
        <br />
        {
          (newItemNames.length > 0 && !loading)  ?
            <Button theme="dark" onClick={editPhotoData}> Save </Button> :
            <Button onClick={editItem} theme="light">Edit</Button>
        }
      </Container>
      <br /><br />
      <h4>Your Bank: {bank.toLocaleString('en-US', { style: 'currency', currency: 'USD',})}</h4>
      <br/><br/>
    </>
  );
}
