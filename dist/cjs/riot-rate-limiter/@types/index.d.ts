import { RequestInfo, RequestInit } from "node-fetch";
export interface ConstructorParams {
    debug?: boolean;
    concurrency?: number;
    retryAfterDefault?: number;
    retryCount?: number;
    datastore?: "local";
}
export interface ExecuteParameters {
    url: RequestInfo;
    options: RequestInit;
}
export interface ExecuteRequestParameters {
    req: ExecuteParameters;
    region: PlatformId;
    method: string;
}
export declare enum PlatformId {
    EUW1 = "euw1",
    EUNE1 = "eun1",
    NA1 = "na1",
    LA1 = "la1",
    LA2 = "la2",
    KR = "kr",
    JP1 = "jp1",
    BR1 = "br1",
    OC1 = "oc1",
    RU = "ru",
    TR1 = "tr1",
    EUROPE = "europe",
    ASIA = "asia",
    SEA = "sea",
    AMERICAS = "americas",
    AP = "ap",
    BR = "br",
    EU = "eu",
    NA = "na",
    LATAM = "latam"
}
export declare enum LimitType {
    APPLICATION = "application",
    METHOD = "method",
    SERVICE = "service"
}
export interface RateLimits {
    appLimits: string;
    appCounts: string;
    methodLimits: string;
    methodCounts: string;
    limitType: LimitType | null;
    retryAfter: number | null;
}
export declare const HOST = ":platformId.api.riotgames.com";
export interface METHODS {
    ACCOUNT: {
        GET_BY_PUUID: string;
        GET_BY_RIOT_ID: string;
        GET_ACTIVE_SHARD_FOR_PLAYER: string;
    };
    CHAMPION_MASTERY: {
        GET_ALL_CHAMPIONS: string;
        GET_CHAMPION_MASTERY: string;
        GET_CHAMPION_MASTERY_SCORE: string;
    };
    CHAMPION: {
        GET_CHAMPION_ROTATIONS: string;
    };
    CLASH: {
        GET_PLAYERS_BY_SUMMONER: string;
        GET_TEAM: string;
        GET_TOURNAMENTS: string;
        GET_TOURNAMENT: string;
        GET_TOURNAMENT_TEAM: string;
    };
    LEAGUE_EXP: {
        GET_LEAGUE_ENTRIES: string;
    };
    LEAGUE: {
        GET_CHALLENGER_BY_QUEUE: string;
        GET_ENTRIES_BY_SUMMONER: string;
        GET_ALL_ENTRIES: string;
        GET_GRANDMASTER_BY_QUEUE: string;
        GET_LEAGUE_BY_ID: string;
        GET_MASTER_BY_QUEUE: string;
    };
    LOR_MATCH: {
        GET_MATCH_IDS_BY_PUUID: string;
        GET_MATCH_BY_ID: string;
    };
    LOR_RANKED: {
        GET_MASTER_TIER: string;
    };
    MATCH: {
        GET_IDS_BY_TOURNAMENT_CODE: string;
        GET_MATCH_BY_ID: string;
        GET_MATCH_BY_ID_AND_TOURNAMENT_CODE: string;
        GET_MATCHLIST_BY_ACCOUNT: string;
        GET_TIMELINE_BY_MATCH_ID: string;
    };
    MATCH_V5: {
        GET_IDS_BY_PUUID: string;
        GET_MATCH_BY_ID: string;
        GET_MATCH_TIMELINE_BY_ID: string;
    };
    SPECTATOR: {
        GET_GAME_BY_SUMMONER_ID: string;
        GET_FEATURED_GAMES: string;
    };
    SUMMONER: {
        GET_BY_ACCOUNT_ID: string;
        GET_BY_SUMMONER_NAME: string;
        GET_BY_PUUID: string;
        GET_BY_SUMMONER_ID: string;
        GET_BY_ACCESS_TOKEN: string;
    };
    TFT_LEAGUE: {
        GET_CHALLENGER: string;
        GET_ENTRIES_BY_SUMMONER: string;
        GET_ALL_ENTRIES: string;
        GET_GRANDMASTER: string;
        GET_LEAGUE_BY_ID: string;
        GET_MASTER: string;
    };
    TFT_MATCH: {
        GET_MATCH_IDS_BY_PUUID: string;
        GET_MATCH_BY_ID: string;
    };
    TFT_SUMMONER: {
        GET_BY_ACCOUNT_ID: string;
        GET_BY_SUMMONER_NAME: string;
        GET_BY_PUUID: string;
        GET_BY_SUMMONER_ID: string;
    };
    THIRD_PARTY_CODE: {
        GET_BY_SUMMONER_ID: string;
    };
    TOURNAMENT_STUB: {
        POST_CREATE_CODES: string;
        GET_LOBBY_EVENTS_BY_TOURNAMENT_CODE: string;
        POST_CREATE_PROVIDER: string;
        POST_CREATE_TOURNAMENT: string;
    };
    TOURNAMENT: {
        POST_CREATE_CODES: string;
        GET_TOURNAMENT_BY_CODE: string;
        PUT_TOURNAMENT_CODE: string;
        GET_LOBBY_EVENTS_BY_TOURNAMENT_CODE: string;
        POST_CREATE_PROVIDER: string;
        POST_CREATE_TOURNAMENT: string;
    };
    VAL_CONTENT: {
        GET_CONTENT: string;
    };
    VAL_MATCH: {
        GET_MATCH_BY_ID: string;
        GET_MATCHLIST_BY_PUUID: string;
        GET_RECENT_MATCHES_BY_QUEUE: string;
    };
    [key: string]: any;
}
export declare const METHODS: METHODS;
