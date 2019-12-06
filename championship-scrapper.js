#!/usr/bin/env node
const puppeteer = require('puppeteer');
const moment = require('momen');

const { Classificacao } = require('./app/models');


async function init() {
    let year = moment().get('year');

    try {
        year = process.argv.slice(2)[0].replace(/[^\d]+/, '');
    } catch (error) {
    }

    const browser = await puppeteer.launch({headless: false, devtools: true});
    const page = await browser.newPage();
    await page.goto(`https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/${year}`);

    let dataSelector = `table.table.m-b-20 > tbody > tr`;

    if(year >= year - 1) {
        dataSelector = dataSelector + '.expand-trigger'
    }

    const tablePoints = await page.$$(dataSelector);

    for (const tr of tablePoints) {
        const points = await tr.$eval('th', th => th.innerText);
        const team = await tr.$eval('td > span:last-child', td => td.innerText.split('-')[0]);

        const statistics = await tr.$$eval('td', td => {
            const infoIndex = ['jogos', 'vitorias', 'empates', 'derrotas', 'gp', 'gc', 'sg', 'ca', 'cv'];
            const data = td.slice(1, infoIndex.length+1);

            return data
                .reduce((acc, cur, index) =>  {
                acc[infoIndex[index]] = cur.innerText;
                        return acc;
            }, {});
        });

        statistics['pontos'] = points;

        try {
            const teamAlreadyExists = await Classificacao.findAll({
                where: {time: team, ano: year}});

            if(teamAlreadyExists.length) {
                Classificacao.update(statistics, {where: {time: team, ano: year}});
                console.log(`Atualizou a classificação do time: ${team}`);
            }
            else{
                statistics['ano'] = year;
                statistics['time'] = team;
                Classificacao.create(statistics);
                console.log(`Salvou o time: ${team}`);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

init();