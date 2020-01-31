import * as moment from 'moment';
import * as program from 'commander';
import * as puppeteer from 'puppeteer';

import { createObjectCsvWriter } from 'csv-writer';

import { Round, ChampionshipData } from './types/types';
import { RodadasCrawler } from './rodadas-crawler';
import { ClassificacaoCrawler } from './classificacao-crawler';


program
    .name('cbr-crawler')
    .option('--year', 'Ano em que ocorreu o campeonato')
    .option('--out-dir', 'Diretorio onde o arquivo vai ser salvo')
    .option('--extract-rounds', 'Extrai as rodadas')
    .option('--save-csv', 'Salva a saida para um arquivo CSV')
    .option('--save-json', 'Salvar a saida em um arquivo JSON');


program.parse(process.argv);

console.log(program)
console.log(`${program.outDir ? program.outDir : __dirname}/brasileirao-${program.year}.csv`)

async function createCSVOutput(data: any, year: number): Promise<void> {
    const path = `${program.path ? program.path : __dirname}/brasileirao-${year}.csv`;

    const csvWriter = createObjectCsvWriter({
        path: path,
        header: [
            {id: 'gp',title: 'gp'},
            {id: 'gc', title: 'gc'},
            {id: 'ca', title: 'ca'},
            {id: 'sg', title: 'sg'},
            {id: 'cv', title: 'cv'},
            {id: 'jogos', title: 'jogos'},
            {id: 'empates', title: 'empates'},
            {id: 'vitorias', title: 'vitorias'},
            {id: 'derrotas', title: 'derrotas'}
        ]
    });

    await csvWriter.writeRecords(data);

    console.log(`As classificações foram exportadas para o arquivo: ${program.path}`);
}

function createJSONOutput(data: any, year: number): void {
    const filePath = `${__dirname}/brasileiro-${year}.json`
}

async function init(): Promise<void> {
    const pupuppeteer = await puppeteer.launch({headless: false, devtools: true});
    const currentYear =  moment().get('year');
    const classificacaoCrawler = new ClassificacaoCrawler(currentYear, pupuppeteer);
    
    let roundMatches = null;
    let rodadasCrawler = null;
    if(program.extractRounds) {
        rodadasCrawler = new RodadasCrawler(currentYear, pupuppeteer);
        roundMatches = await rodadasCrawler.initRoundExtraction();
    }

    const teamsClassifications = await classificacaoCrawler.init();

}