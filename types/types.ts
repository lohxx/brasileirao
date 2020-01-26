export interface TeamStatistics {
    sg: string,
    gp: string,
    gc: string,
    ca: string,
    cv: string,
    jogos: string,
    empates: string,
    vitorias: string,
    derrotas: string
}

export interface TeamClassification {
    time: string,
    pontos: string
}

export interface Round {
    hora: string,
    rodada: number,
    endereco: string,
    timeCasa: string,
    timeVisitante: string
}

export type ChampionshipData = (TeamClassification | TeamStatistics)[];

