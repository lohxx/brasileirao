#!/usr/bin/env node


const commander = require('commander');
const puppeteer = require('puppeteer');
const { Classificacao } = require('./app/models');

const program = new commander.Command();

program
    .command('init')
    .description('Extrai as informações relacionadas ao campeonato brasileiro.')
    .option('-y --year', 'ano em que o campeonato foi realizado', 2019)
    .action(() => console.log('hello'))
    .parse(process.argv);


async function init() {
    const browser = await puppeteer.launch({headless: false, devtools: true});
    const page = await browser.newPage();
    await page.goto(`https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/${program.year}`);

    const tablePoints = await page.$$('table.table.m-b-20 > tbody > tr.expand-trigger');

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
                where: {time: team, ano: program.year}});

            if(teamAlreadyExists.length) {
                Classificacao.update(statistics, {where: {time: team, ano: program.year}});
                console.log(`Atualizou a classificação do time: ${team}`);
            }
            else{
                statistics['ano'] = program.year;
                statistics['time'] = team;
                Classificacao.create(statistics);
                console.log(`Salvou o time: ${team}`);
            }
        } catch (error) {
            console.error(error);
        }
    }
}