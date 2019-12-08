import express from 'express';
import { Classificacao, Rodada } from './app/models';

const app = express();

//app.use(cors());
//app.use(bodyParser.json());


const { Classificacao, Rodada } = require('./app/models');


app.use(express.urlencoded({extended: false}));

app.get('/classificacao', async (req, res) => {
	const classificacao = await Classificacao.findAll();
	res.send(classificacao);
});


app.listen(3000);
