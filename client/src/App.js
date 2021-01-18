import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

import { Button, Container, Nav, NavItem } from "shards-react";
import CustomerProfile from './containers/Customer';
import MerchantProfile from './containers/Merchant';

function App() {
  let [isMerchant, setIsMerchant] = useState(true)

  return (
    <Container>
      <br/><br/>
      <h2> Gallery </h2>
      <br/>
      <Nav pills>
        <NavItem>
          <Button theme={isMerchant ? 'dark' : 'light'} onClick={() => {setIsMerchant(true)}}> Merchant </Button>
        </NavItem>
        <NavItem>
          <Button theme={!isMerchant ? 'dark' : 'light'} onClick={() => {setIsMerchant(false)}}> Customer </Button>
        </NavItem>
      </Nav>
      <Container>
        {isMerchant && <MerchantProfile/>}
        {!isMerchant && <CustomerProfile/>}
      </Container>
    </Container>
  );
}

export default App;
