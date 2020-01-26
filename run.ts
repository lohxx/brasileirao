import * as moment from 'moment';
import * as puppeteer from 'puppeteer';

import { RodadasCrawler } from './rodadas-crawler';
import { ClassificacaoCrawler } from './classificacao-crawler';


async function init() {
    const pupuppeteer = await puppeteer.launch({headless: false, devtools: true});
    const currentYear =  moment().get('year');
    const classificacaoCrawler = new ClassificacaoCrawler(currentYear, pupuppeteer);
    const rodadasCrawler = new RodadasCrawler(currentYear, pupuppeteer);

    const t = await rodadasCrawler.initRoundExtraction();
    return t;
}

init().then(e => console.log(e));