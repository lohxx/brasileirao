export interface TeamStatistics {
    sg: number,
    gp: number,
    gc: number,
    ca: number,
    cv: number,
    jogos: number,
    empates: number,
    vitorias: number,
    derrotas: number
}

export interface TeamClassification {
    time: string,
    pontos: number
}

export interface Round {
    hora: string,
    rodada: number,
    endereco: string,
    timeCasa: string,
    resultado: string,
    timeVisitante: string
}

export type ChampionshipData = (TeamClassification | TeamStatistics)[];

