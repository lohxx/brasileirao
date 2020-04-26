import * as fs from 'fs';
import * as xl from 'excel4node';

import { createObjectCsvWriter } from 'csv-writer';

export class Export {
    currentDir = process.env.PWD;

    constructor(private data: any,  private year: number) {}

    async saveToJSON(): Promise<void> {
        const path2 = `${this.currentDir}/brasileirao-${this.year}.json`;

        try {
            fs.writeFile(path2, JSON.stringify(this.data), () => {});
            console.log(`As classificações foram exportadas para o arquivo: ${path2}`);
        } catch (error) {
            console.error(error);
        }
    }

    async saveToCSV(): Promise<object | undefined> {
        const path2 = `${this.currentDir}/brasileirao-${this.year}.csv`;

        const csvWriter = createObjectCsvWriter({
            path: path2,
            header: [
                {id: 'time', title: 'time'},
                {id: 'gp',title: 'gp'},
                {id: 'gc', title: 'gc'},
                {id: 'ca', title: 'ca'},
                {id: 'sg', title: 'sg'},
                {id: 'cv', title: 'cv'},
                {id: 'jogos', title: 'jogos'},
                {id: 'empates', title: 'empates'},
                {id: 'vitorias', title: 'vitorias'},
                {id: 'derrotas', title: 'derrotas'}
            ]
        });
    
        try {
            await csvWriter.writeRecords(this.data);
            console.log(`As classificações foram exportadas para o arquivo: ${path2}`);
        } catch (error) {
            console.error(error);
        }

	    return {};
    }


    /**
     * Adiciona os dados no excel
     * @param  {object[]} data
     * @param  {any} sheet
     * @param  {string[]} colsTitles
     * @returns void
     */
    insertRows(data: object[], sheet: any, colsTitles: string[]): void {

        for(let col in colsTitles) {
            sheet.cell(1, parseInt(col)+1).string(colsTitles[col]);
        };

        let auxIndex = 1;
        for(let index in data) {
            for (let key in data[index]) {
                sheet.cell(parseInt(index)+2, auxIndex).string(data[index][key]);
                auxIndex += 1;
            }
            auxIndex = 1;
        }
    }


    /**
     * Cria e salva o excel
     * @returns void
     */
    saveToExcel(): void {
        const workBook = new xl.Workbook();
        const rodadasSheet = workBook.addWorksheet(`Rodadas`);
        const classificacaoSheet = workBook.addWorksheet(`Classificações`);

        this.insertRows(this.data['rodadas'], rodadasSheet, Object.keys(this.data['rodadas'][0]));
        this.insertRows(this.data['classificacoes'], classificacaoSheet, Object.keys(this.data['classificacoes'][0]));
        workBook.write(`${this.currentDir}/brasileirao-${this.year}.xlsx`);
    }
}
