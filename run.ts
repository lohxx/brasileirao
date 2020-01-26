import * as moment from 'moment';
import * as puppeteer from 'puppeteer';

import { Round, ChampionshipData } from './types/types';
import { RodadasCrawler } from './rodadas-crawler';
import { ClassificacaoCrawler } from './classificacao-crawler';


async function init(): Promise<[Round[], ChampionshipData]> {
    const pupuppeteer = await puppeteer.launch({headless: false, devtools: true});
    const currentYear =  moment().get('year');
    const classificacaoCrawler = new ClassificacaoCrawler(currentYear, pupuppeteer);
    const rodadasCrawler = new RodadasCrawler(currentYear, pupuppeteer);

    const roundMatches = await rodadasCrawler.initRoundExtraction();
    const teamsClassifications = await classificacaoCrawler.init();
    return [roundMatches, teamsClassifications];
}

init().then(e => console.log(e));