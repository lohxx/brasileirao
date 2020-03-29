import * as fs from 'fs';
import * as path from 'path';

import { createObjectCsvWriter } from 'csv-writer';



class Export {
    constructor(private directory: string, private data: any,  private year: number) {}

    async saveToJSON(): Promise<void> {
        const dir = path.parse(this.directory).dir;
        const path2 = `${dir}/brasileirao-${this.year}.json`;

        try {
            fs.writeFile(path2, JSON.stringify(this.data), () => {});
            console.log(`As classificações foram exportadas para o arquivo: ${path2}`);
        } catch (error) {
            console.error(error);
        }
    }

    async saveToCSV(): Promise<object> {
        const dir = path.parse(this.directory).dir;
        const path2 = `${dir}/brasileirao-${this.year}.csv`;

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

    saveToExcel(): void {
    }

}
