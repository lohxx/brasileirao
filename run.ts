import * as moment from 'moment';


import { RodadasCrawler } from './rodadas-scrapper';
import { ClassificacaoCrawler } from './classificacao-scrapper';


const currentYear =  moment().get('year');
const crawler = new ClassificacaoCrawler(currentYear, {headless: false, devtools: true});


crawler.init().then(e => console.log(e));