const moment = require('moment');
const puppeteer = require('puppeteer');
const { Rodada } = require('../app/models');


async function extractRouds() {

    const currentYear = moment().get('year');
    const browser = await puppeteer.launch({headless: false, devtools: true});
    const page = await browser.newPage();
    await page.goto(`https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/${currentYear}`);

    const selector = await page.$(`aside.aside-rodadas > div.swiper-wrapper > div.swiper-slide.active.swiper-slide-active`);

    const roundNumber =  await selector.$eval(
        'header.aside-header > h3', 
        header => header.innerText.replace(/[^\d]+/, '')
    );

    const jogosRodada = await selector.$$('div.aside-content > ul > li > div', div => div);

    for(const jogo of jogosRodada) {
        const [JogoEndereco, jogoDataHora] = await jogo.$$eval('span.partida-desc', spans => {
            return [
                spans[1].innerText,
                spans[0].innerText.match(/(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2})/)[0],
            ];
        });
        const timeCasa = await jogo.$eval('div.clearfix > a > div.time.pull-left > img', time => time.title);
        const timeVisitante = await jogo.$eval('div.clearfix > a div.pull-right > img', time => time.title);

        try {
            Rodada.create({
                casa: timeCasa,
                rodada: roundNumber,
                visitante: timeVisitante,
                data: new Date(jogoDataHora),
            });
            console.log(`Partida: ${timeCasa} x ${timeVisitante} as ${jogoDataHora}, registrada`);
        } catch (error) {
            console.error(error);
        }
    }
}


module.exports = extractRouds;