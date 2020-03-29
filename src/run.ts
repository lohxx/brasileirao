#!/usr/bin/env node

import * as ora from 'ora';
import * as moment from 'moment';
import * as program from 'commander';
import * as puppeteer from 'puppeteer';

import { cwd } from 'process';
import { RodadasCrawler } from './rodadas';
import { ClassificacaoCrawler } from './classificacao';


program
    .name('brasileirao-api')
    .option('-y, --year <int>', 'Ano em que ocorreu o campeonato', (year) => year, moment().get('year'))
    .option('-d, --out-dir <str>', 'Diretorio onde o arquivo vai ser salvo', (dir) => dir, cwd())
    .option('--extract-rounds', 'Extrai as rodadas')
    .option('--save-csv', 'Salva a saida para um arquivo CSV')
    .option('--save-json', 'Salvar a saida em um arquivo JSON')
    .parse(process.argv);


async function init(): Promise<null> {
    const browser = await puppeteer.launch({headless: false, devtools: true});

    const rodadasCrawler = new RodadasCrawler(program.year, browser);
    const classificacaoCrawler = new ClassificacaoCrawler(program.year, browser);

    try {
        const spinner = ora('Extraindo as classificações').start();

        const teamsClassifications = await classificacaoCrawler.init();
        const championshipMatches = await rodadasCrawler.init()

        // para o spinner depois que os dados foram retornados
        spinner.stop();

        //const exportJsonService = new ExportJson();
        //const exportCsvService = new ExportCsv();

        if(program.saveCsv) {
            //exportCsvService.save(program.outDir, teamsClassifications, program.year);
        }

        else if (program.saveJson) {
            //exportJsonService.save(program.outDir, teamsClassifications, program.year);
        }
        else {
            console.log('Não foi selecionado nenhuma das opções para exportar os dados, vai ser mostrado no console');
            console.log()
            console.log('##### CLASSIFICAÇÕES #####');
            console.log(teamsClassifications);
            console.log()
            console.log('##### RODADAS #####');
            console.log(championshipMatches);
        }
        browser.close();
    } catch (error) {
        browser.close();
    }

    return null
}


init()
    .then(
        () => { },
        error => { console.error(error) });
