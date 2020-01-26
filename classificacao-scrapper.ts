import * as moment from 'moment';
import * as puppeteer from 'puppeteer';
import { ElementHandle } from 'puppeteer';


export class ClassificacaoCrawler {
    site: string;
    year: number;
    launchOptions: object;

    tableRowsSelector = `table.m-b-20 > tbody > tr`;
    
    constructor(year: number, launchOptions: object = {}) {
        this.year = year;
        this.launchOptions = launchOptions;
        this.site = `https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/${this.year}`;
        this.chooseRowSelector();
    }

    chooseRowSelector(): void {
        const now = moment();

        if (this.year != now.get('year')) {
            this.tableRowsSelector = `table.m-b-20.tabela-expandir > tbody > tr.expand-trigger`;
        }
    }

    /**
     * Inicializa a extração do site da CBF
     * @returns Promise
     */
    async init(): Promise<object[]> {
        const browser = await puppeteer.launch(this.launchOptions);
        const page = await browser.newPage();
        await page.goto(this.site);
        const rows = await page.$$(this.tableRowsSelector);

        const championshipData = await this.extractClassifications(rows);

        return championshipData;
    }
    
    /**
     * Extrai e junta as informações de cada time participante
     * do campeonato brasileiro.
     * @param  {ElementHandle[]} tableRows
     * @returns Promise
     */
    async extractClassifications(tableRows: ElementHandle[]): Promise<object[]> {
        const data = [];

        for(const tableRow of tableRows) {
            try {
                const points: string = await tableRow.$eval('th', (th: any) => th.innerText);
                const team: string = await tableRow.$eval('td > span:last-child', (td: any) => td.innerText.split('-')[0]);
                const statistics = await this.extractStatistics(tableRow);
                data.push({time: team, pontos: points, ...statistics});
            } catch (error) {
                continue
            }
        }

        return data;
    }

    
    /**
     * Extrai as estatisticas de cada time participando do brasileirão.
     * @param  {ElementHandle} tableRow
     * @returns Promise
     */
    async extractStatistics(tableRow: ElementHandle): Promise<object> {
        const statistics = await tableRow.$$eval('td', td => {
            const infoIndex = ['jogos', 'vitorias', 'empates', 'derrotas', 'gp', 'gc', 'sg', 'ca', 'cv'];
            const data = td.slice(1, infoIndex.length+1);

            return data.reduce((statisticTeam: any, statistic:any, index: number) =>  {
                statisticTeam[infoIndex[index]] = statistic.innerText;
                return statisticTeam;
            }, {});
        });

        return statistics;
    }
}