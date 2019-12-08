const express = require('express');
const { Classificacao, Rodada } = require('./app/models');

const app = express();


app.use(express.urlencoded({extended: false}));


app.get('/classificacao', async (req, res) => {
	const classificacao = await Classificacao.findAll({
		where: req.query,
		order: [['pontos', 'DESC']]
	});
	res.send(classificacao);
});


app.listen(3000);
