import * as fs from 'fs';

import { createObjectCsvWriter } from 'csv-writer';


interface Export {
    save(): Promise<void>
}

export class ExportJson implements Export {
    constructor(public directory: string, public data: any, public year: number) {}

    async save(): Promise<void> {
        const path = `${this.directory}/brasileirao-${this.year}.json`;

        try {
            fs.watchFile(path, this.data);
            console.log(`As classificações foram exportadas para o arquivo: ${path}`);
        } catch (error) {
            console.error(error);
        }
    }
}

export class ExportCsv implements Export {
    constructor(public directory: string, public data: any, public year: number) {}

    async save(): Promise<void> {
        const path = `${this.directory}/brasileirao-${this.year}.csv`;

        const csvWriter = createObjectCsvWriter({
            path: path,
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
            console.log(`As classificações foram exportadas para o arquivo: ${path}`);
        } catch (error) {
            console.error(error);
        }
    }
}