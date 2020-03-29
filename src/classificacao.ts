import * as moment from 'moment';
import { ElementHandle, Browser } from 'puppeteer';

import { ChampionshipData, TeamStatistics, TeamClassification } from '../types/types';


export class ClassificacaoCrawler {
    site: string;
    tableRowsSelector = `table.m-b-20 > tbody > tr`;
    
    constructor(private year: number, private browser: Browser) {
        this.site = `https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/${this.year}`;
        this.chooseRowSelector();
    }

    chooseRowSelector(): void {
        const now = moment();

        if (this.year != now.get('year')) {
            this.tableRowsSelector = `table.m-b-20.tabela-expandir > tbody > tr`;
        }
    }

    /**
     * Inicializa a extração do site da CBF
     * @returns Promise
     */
    async init(): Promise<ChampionshipData> {;
        const page = await this.browser.newPage();
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
    async extractClassifications(tableRows: ElementHandle[]): Promise<ChampionshipData> {
        const data: ChampionshipData = [];

        for(const tableRow of tableRows) {
            try {
                const points: string = await tableRow.$eval('th', (th: any) => th.innerText);
                const team: string = await tableRow.$eval('td > span:last-child', (td: any) => td.innerText.split('-')[0]);
                const statistics = await this.extractStatistics(tableRow);
                const classificacao: TeamClassification = {time: team.trim(), pontos: points};
                data.push({...classificacao, ...statistics});
            } catch (error) {
                continue
            }
        }

        console.log(data);

        return data;
    }

    /**
     * Extrai as estatisticas de cada time participando do brasileirão.
     * @param  {ElementHandle} tableRow
     * @returns Promise
     */
    async extractStatistics(tableRow: ElementHandle): Promise<TeamStatistics> {
        const statistics = await tableRow.$$eval('td', td => {
            const infoIndex = ['jogos', 'vitorias', 'empates', 'derrotas', 'gp', 'gc', 'sg', 'ca', 'cv'];
            const data: Element[] = td.slice(1, infoIndex.length+1);

            return data.reduce((statisticTeam: any, statistic: any, index: number) =>  {
                statisticTeam[infoIndex[index]] = statistic.innerText;
                return statisticTeam;
            }, {});
        });

        return statistics;
    }
}