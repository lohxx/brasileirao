import { TeamClassification } from './../types/types';
import * as puppeteer from 'puppeteer';
import { ClassificacaoCrawler } from '../classificacao-crawler';


describe('testes basicos', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    test('Afirma o campeão do campeonato de 2019', async () => {
        const browser = await puppeteer.launch();
        const crawler = new ClassificacaoCrawler(2019, browser);
        const championshipWinner = await crawler.init();

        const flamengo = { 
            time: 'Flamengo',
            pontos: '90',
            jogos: '38',
            vitorias: '28',
            empates: '6',
            derrotas: '4',
            gp: '86',
            gc: '37',
            sg: '49',
            ca: '90',
            cv: '3', 
        };

        expect(championshipWinner[0]).toEqual(flamengo);
        browser.close();
    });

    test('Afirma o campeão do campeonato de 2016', async () => {
        const browser = await puppeteer.launch();
        const crawler = new ClassificacaoCrawler(2016, browser);
        const championshipWinner = await crawler.init();

        const palmeiras = {
            time: 'Palmeiras',
            pontos: '80',
            jogos: '38',
            vitorias: '24',
            empates: '8',
            derrotas: '6',
            gp: '62',
            gc: '32',
            sg: '30',
            ca: '95',
            cv: '0' 
        }

        expect(championshipWinner[0]).toEqual(palmeiras);
        browser.close();
    });

    test('Afirma os rebaixados do campeonato de 2012', async () => {
        const browser = await puppeteer.launch();
        const crawler = new ClassificacaoCrawler(2012, browser);
        const championshipData = await crawler.init();

        const rebaixados2012 = championshipData.slice(-4);
        expect(rebaixados2012).toEqual([
            { 
                time: 'Sport',
                pontos: '41',
                jogos: '38',
                vitorias: '10',
                empates: '11',
                derrotas: '17',
                gp: '39',
                gc: '56',
                sg: '-17',
                ca: '85',
                cv: '8' 
            },
            { 
                time: 'Palmeiras',
                pontos: '34',
                jogos: '38',
                vitorias: '9',
                empates: '7',
                derrotas: '22',
                gp: '39',
                gc: '54',
                sg: '-15',
                ca: '106',
                cv: '6' 
            },
            { 
                time: 'Atlético',
                pontos: '30',
                jogos: '38',
                vitorias: '7',
                empates: '9',
                derrotas: '22',
                gp: '37',
                gc: '67',
                sg: '-30',
                ca: '102',
                cv: '6' 
            },
            { 
                time: 'Figueirense',
                pontos: '30',
                jogos: '38',
                vitorias: '7',
                empates: '9',
                derrotas: '22',
                gp: '39',
                gc: '72',
                sg: '-33',
                ca: '95',
                cv: '9' 
            }
        ])
        browser.close();
    });

    test('Classificados para a Libertadores de 2016', async () => {
        const browser = await puppeteer.launch();
        const crawler = new ClassificacaoCrawler(2015, browser);
        const championshipData = await crawler.init();

        const campeaoCopaBrasil = 'Palmeiras';
        const libertadores = [0, 1, 2, 3]
            .map(classifPos => (championshipData[classifPos] as TeamClassification).time);

        libertadores.push(campeaoCopaBrasil);

        const classificadosLibertadores = ['Corinthians', 'Atlético', 'Grêmio', 'São Paulo', campeaoCopaBrasil];

        libertadores.sort();
        classificadosLibertadores.sort();
        
        expect(libertadores).toEqual(classificadosLibertadores);
        
        browser.close();
    });

});
