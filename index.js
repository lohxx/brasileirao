const express = require('express');

const app = express();

const { Classificacao } = require('./app/models');


app.use(express.urlencoded({extended: false}));

app.get('/classificacao', (req, res) => {
	res.send('Hello World');
});


app.listen(3000);
