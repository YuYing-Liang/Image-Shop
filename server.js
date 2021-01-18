const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const mongoURI = process.env.MONGO_URI || require("./config/keys.json").mongoURI;
mongoose
	.connect(mongoURI, { useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err));
mongoose.set('useNewUrlParser', true);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(__dirname + '/client/build'));


require ('./routes/merchantRoutes')(app);   
require ('./routes/customerRoutes')(app);

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/client/build/index.html');
});

app.listen(process.env.PORT || 5000, () => {
	console.log('starting listening at port 5000');
});