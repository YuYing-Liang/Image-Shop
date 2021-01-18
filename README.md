# Image Shop

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project is a prototype of a online store for digital creators. Artists and  photographers can easily upload their work and set prices only with a couple simple steps. 

This website was created with ReactJS and Shards-UI frontend paired with a NodeJS backend. 

Merchant and customer information is stored in a NoSQL MongoDB database and this website is hosted on heroku.
[View the Demo Here](https://image-shop.herokuapp.com/)

## How to use:
Toggle between the Customer and Merchant tabs to see how the store will behave on each end. On the merchant side, you can upload photos and sell them (by making them public) and manage your inventory and sales. On the customer side, you can select items available for purchase and add them to your cart.

This website is not perfect and still a work in progress. If you run into problems loading images on the merchant side, click the refresh button and your images should reappear.

## Run it yourself:

Clone this project and add a folder named `conifg` in the main directory. In that folder add a file called `keys.json` with this json object: 

`{ mongoURI: <your mongodb uri> }`