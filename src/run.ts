import * as ora from 'ora';
import * as moment from 'moment';
import * as program from 'commander';
import * as puppeteer from 'puppeteer';

import { cwd } from 'process';
import { ExportCsv, ExportJson } from './export';
import { ClassificacaoCrawler } from './classificacao';


program
    .name('cbr-crawler')
    .option('-y, --year <int>', 'Ano em que ocorreu o campeonato')
    .option('-d, --out-dir <str>', 'Diretorio onde o arquivo vai ser salvo', (dir) => dir, cwd())
    .option('--extract-rounds', 'Extrai as rodadas')
    .option('--save-csv', 'Salva a saida para um arquivo CSV')
    .option('--save-json', 'Salvar a saida em um arquivo JSON')
    .parse(process.argv);


async function init(): Promise<void> {
    const browser = await puppeteer.launch({headless: true, devtools: true});
    const extractYear =  program.year ? program.year : moment().get('year');
    const classificacaoCrawler = new ClassificacaoCrawler(extractYear, browser);

    try {
        const spinner = ora('Extraindo as classificações').start();

        const teamsClassifications = await classificacaoCrawler.init();

        // para o spinner depois que os dados foram retornados
        spinner.stop();

        const exportJsonService = new ExportJson();
        const exportCsvService = new ExportCsv();

        if(program.saveCsv) {
            exportCsvService.save(program.outDir, teamsClassifications, extractYear);
        }

        else if (program.saveJson) {
            exportJsonService.save(program.outDir, teamsClassifications, extractYear);
        }

    } catch (error) {
        browser.close();
    }
}


init()
    .then(
        success => { },
        error => { console.error(error) }
    );