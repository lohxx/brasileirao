import * as puppeteer from 'puppeteer';

import { Round } from '../types/types';

export class RodadasCrawler {
    url: string;

    /**
     * Inicializa a instancia do crawler das rodadas
     * @param  {number} private year - ano de realização do campeonato.
     * @param  {puppeteer.Browser} private browser
     */
    constructor(private year: number, private browser: puppeteer.Browser) { 
        this.url = `https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/${this.year}`;
    }

    /**
     * Inicia a extração das rodadas.
     * @returns Promise
     */
    async init(): Promise<Round[]> {
        const page = await this.browser.newPage();
        await page.goto(this.url);
        let rodadas: Round[] = [];

        const matches = await page.$$('aside.aside-rodadas > div.swiper-wrapper > div.swiper-slide[data-slide-index]');
        for (const match of matches) {
            const roundMatches = await match?.$$('div.aside-content > ul > li > div');
            const roundInfos = await this.extractRounds(match, roundMatches); 
            rodadas = rodadas.concat(roundInfos);
        }

        return rodadas;
    }

    /**
     * Extrai as informações sobre as rodadas.
     * @param  {puppeteer.ElementHandle|null} div
     * @param  {puppeteer.ElementHandle[]|undefined=[]} matches
     * @returns Promise
     */
    async extractRounds(div: puppeteer.ElementHandle | null, matches: puppeteer.ElementHandle[] | undefined = []): Promise<Round[]> {
        const roundMatches: Round[] = [];

        const roundNumber = await div?.$eval('header.aside-header > h3', (header: any) => header.innerText.replace(/[^\d]+/, ''));

        for(const match of matches) {
            const houseTeam = await match.$eval('div.clearfix > a > div.time.pull-left > img', (team: any) => team.title);
            const visitantTeam = await match.$eval('div.clearfix > a div.pull-right > img', (team: any) => team.title);
            const [matchAddress, matchDate] = await match.$$eval('span.partida-desc', (spans: any) => {
                return [
                    spans[1].innerText,
                    spans[0].innerText.match(/(\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2})/)[0]
                ];
            });

            roundMatches.push({
                hora: matchDate,
                rodada: roundNumber,
                timeCasa: houseTeam,
                endereco: matchAddress,
                timeVisitante: visitantTeam,
            });
        }

        return roundMatches;
    }
}
