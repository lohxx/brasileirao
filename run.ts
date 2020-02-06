import * as moment from 'moment';
import * as program from 'commander';
import * as puppeteer from 'puppeteer';

import { RodadasCrawler } from './rodadas-crawler';
import { ExportCsv, ExportJson } from './export';
import { ClassificacaoCrawler } from './classificacao-crawler';


program
    .name('cbr-crawler')
    .option('--year', 'Ano em que ocorreu o campeonato')
    .option('--out-dir', 'Diretorio onde o arquivo vai ser salvo')
    .option('--extract-rounds', 'Extrai as rodadas')
    .option('--save-csv', 'Salva a saida para um arquivo CSV')
    .option('--save-json', 'Salvar a saida em um arquivo JSON');


program.parse(process.argv);


async function init(): Promise<void> {
    const browser = await puppeteer.launch({headless: true, devtools: true});
    const extractYear =  program.year ? program.year : moment().get('year');
    const classificacaoCrawler = new ClassificacaoCrawler(extractYear, browser);

    let roundMatches = null;
    let rodadasCrawler = null;

    try {
        const teamsClassifications = await classificacaoCrawler.init();
        if(program.extractRounds) {
            rodadasCrawler = new RodadasCrawler(extractYear, browser);
            roundMatches = await rodadasCrawler.initRoundExtraction();
        }

        const exportJsonService = new ExportJson();
        const exportCsvService = new ExportCsv();

    } catch (error) {
        browser.close();
    }
}


init()
    .then(
        success => {},
        error => {
            console.error(error);
        }
    );