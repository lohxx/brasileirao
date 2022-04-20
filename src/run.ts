#!/usr/bin/env node

import * as ora from 'ora';
import * as moment from 'moment';
import * as program from 'commander';
import * as puppeteer from 'puppeteer';

import { cwd } from 'process';
import { RodadasCrawler } from './rodadas';
import { ClassificacaoCrawler } from './classificacao';
import { Export } from './export';


program
    .name('brasileirao')
    .option('-y, --year <int>', 'Ano em que ocorreu o campeonato', (year) => year, moment().get('year'))
    .option('--extract-rounds', 'Extrai as rodadas')
    .option('--save-csv', 'Salva a saida para um arquivo CSV')
    .option('--save-json', 'Salva a saida em um arquivo JSON')
    .option('--save-excel', 'Salva a saida em um arquivo Excel')
    .parse(process.argv);


async function init(): Promise<null> {
    const browser = await puppeteer.launch({headless: true});

    const rodadasCrawler = new RodadasCrawler(program.year, browser);
    const classificacaoCrawler = new ClassificacaoCrawler(program.year, browser);

    try {
        const spinner = ora('Extraindo as classificações').start();
        const teamsClassifications = await classificacaoCrawler.init();
        const championshipMatches = await rodadasCrawler.init()

        // para o spinner depois que os dados foram retornados
        spinner.stop();

        const exportData = new Export(
            {
                'classificacoes': teamsClassifications, 
                'rodadas': championshipMatches
            }, 
            program.year
        );

        if(program.saveJson) {
            exportData.saveToJSON();
        }
        
        if(program.saveCsv) {
            exportData.saveToCSV();
        }
        
        else if(program.saveExcel) {
            exportData.saveToExcel();
        }

        else {
           console.table(teamsClassifications);
        }
        browser.close();
    } catch (error) {
        browser.close();
        console.error(error);
    }
    return null
}


init()
    .then(
        () => { },
        error => { console.error(error) });
