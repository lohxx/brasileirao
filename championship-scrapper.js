const puppeteer = require('puppeteer');
const { zip, from } = require('rxjs');
const express = require('express');

process.env.teams = [];

async function init() {
    const browser = await puppeteer.launch({headless: false, devtools: true});
    const page = await browser.newPage();
    await page.goto('https://globoesporte.globo.com/futebol/brasileirao-serie-a/');

    const tablePoints = await page.$$('.tabela__pontos tbody > tr.classificacao__tabela--linha');
    const tableClassifs = await page.$$('.tabela__equipes.tabela__equipes--com-borda tr.classificacao__tabela--linha');

    zip(from(tableClassifs), from(tablePoints))
        .subscribe( async ([classification, statistics]) => {
            const position = await classification.$eval('td', td => td.innerText);
            const teamName = await classification.$eval('td:nth-child(2) > strong', strong => strong.innerText);

            let championshipStatistic = await statistics.$$eval('td', td => {
                var keyPositions = ['pontos', 'jogos', 'vitorias', 'derrotas', 'gp', 'gc', 'sg', '%', 'Ultimos Jogos'];
                return td.reduce((acc, cur, index) =>  {
                    acc[keyPositions[index]] = cur.innerText;
                    return acc;
                }, {});
            });
            console.log(process.env.teams)
            championshipStatistic = Object.assign(championshipStatistic, {posicao: position, time: teamName});
            //process.env.teams.push(championshipStatistic);
    });

    console.log(process.env.teams);
}


init();

