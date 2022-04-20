# brasileirao
Api que extrai dados sobre a classificação dos clubes que disputam a serie A do brasileirão do site da CBF. É necessario ter o typescript instalado para buildar o projeto.



## Como instalar
- Clone esse repositorio
- Dentro do diretorio criado com o clone desse repositorio, rode o comando: `npm install .`
- Para buildar o projeto é necessario rodar o comando `tsc` na raiz do projeto.
https://www.typescriptlang.org/docs/handbook/compiler-options.html

## Como instalar e usar com o docker

- Clone esse repositorio
- Dentro do repositorio criado, rode o comando: `docker build -t brasileirao .`
- Rode a imagem com o comando:  `docker run brasileirao`

## Como usar

```bash
Usage: brasileirao [options]

Options:
  -y, --year <int>  Ano em que ocorreu o campeonato (default: ano corrente)
  --save-csv        Salva a saida para um arquivo CSV
  --save-json       Salva a saida em um arquivo JSON
  --save-excel      Salva a saida em um arquivo Excel
  -h, --help        output usage information


brasileirao --save-json
brasileirao --save-csv --year=2015
brasileirao --save-excel --year=2019
```

![exemplo](https://github.com/lohxx/brasileirao/blob/master/cli-screenshot.png)
