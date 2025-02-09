import { RiotRateLimiter, PlatformId } from "@fightmegg/riot-rate-limiter";
import { RiotAPITypes } from "./@types";
import { MemoryCache } from "./cache";
import { DDragon } from "./ddragon";
export { RiotAPITypes, PlatformId, DDragon };
export declare class RiotAPI {
    readonly cache?: MemoryCache;
    readonly riotRateLimiter: RiotRateLimiter;
    readonly token: string;
    readonly config: RiotAPITypes.Config;
    ddragon: DDragon;
    constructor(token: string, config?: RiotAPITypes.Config);
    private getHeaders;
    private getOptions;
    private getJobOptions;
    private checkCache;
    private setCache;
    request<T>(platformId: PlatformId, methodKey: string, pathData: {
        [key: string]: string | number;
    }, options?: RiotAPITypes.RequestOptions): Promise<T>;
    get account(): {
        getByPUUID: ({ region, puuid, }: {
            region: RiotAPITypes.Cluster;
            puuid: string;
        }) => Promise<RiotAPITypes.Account.AccountDTO>;
        getByRiotId: ({ region, gameName, tagLine, }: {
            region: RiotAPITypes.Cluster;
            gameName: string;
            tagLine: string;
        }) => Promise<RiotAPITypes.Account.AccountDTO>;
        getActiveShardForPlayer: ({ region, game, puuid, }: {
            region: RiotAPITypes.Cluster;
            game: "val" | "lor";
            puuid: string;
        }) => Promise<RiotAPITypes.Account.ActiveShardDTO>;
    };
    get championMastery(): {
        getAllChampions: ({ region, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            summonerId: string;
        }) => Promise<RiotAPITypes.ChampionMastery.ChampionMasteryDTO[]>;
        getChampion: ({ region, championId, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            championId: number;
            summonerId: string;
        }) => Promise<RiotAPITypes.ChampionMastery.ChampionMasteryDTO>;
        getMasteryScore: ({ region, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            summonerId: string;
        }) => Promise<number>;
    };
    get champion(): {
        getRotations: ({ region, }: {
            region: RiotAPITypes.LoLRegion;
        }) => Promise<RiotAPITypes.Champion.ChampionInfoDTO>;
    };
    get clash(): {
        getPlayersBySummonerId: ({ region, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            summonerId: string;
        }) => Promise<RiotAPITypes.Clash.PlayerDTO[]>;
        getTeamById: ({ region, teamId, }: {
            region: RiotAPITypes.LoLRegion;
            teamId: string;
        }) => Promise<RiotAPITypes.Clash.TeamDTO>;
        getTournaments: ({ region, }: {
            region: RiotAPITypes.LoLRegion;
        }) => Promise<RiotAPITypes.Clash.TournamentDTO[]>;
        getTournamentById: ({ region, tournamentId, }: {
            region: RiotAPITypes.LoLRegion;
            tournamentId: string;
        }) => Promise<RiotAPITypes.Clash.TournamentDTO>;
        getTournamentByTeamId: ({ region, teamId, }: {
            region: RiotAPITypes.LoLRegion;
            teamId: string;
        }) => Promise<RiotAPITypes.Clash.TeamDTO>;
    };
    get leagueExp(): {
        getLeagueEntries: ({ region, queue, tier, division, }: {
            region: RiotAPITypes.LoLRegion;
            queue: RiotAPITypes.QUEUE;
            tier: RiotAPITypes.TIER;
            division: RiotAPITypes.DIVISION;
        }) => Promise<RiotAPITypes.League.LeagueEntryDTO[]>;
    };
    get league(): {
        getChallengerByQueue: ({ region, queue, }: {
            region: RiotAPITypes.LoLRegion;
            queue: RiotAPITypes.QUEUE;
        }) => Promise<RiotAPITypes.League.LeagueListDTO>;
        getEntriesBySummonerId: ({ region, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            summonerId: string;
        }) => Promise<RiotAPITypes.League.LeagueEntryDTO[]>;
        getAllEntries: ({ region, queue, tier, division, }: {
            region: RiotAPITypes.LoLRegion;
            queue: RiotAPITypes.QUEUE;
            tier: RiotAPITypes.TIER;
            division: RiotAPITypes.DIVISION;
        }) => Promise<RiotAPITypes.League.LeagueEntryDTO[]>;
        getGrandmasterByQueue: ({ region, queue, }: {
            region: RiotAPITypes.LoLRegion;
            queue: RiotAPITypes.QUEUE;
        }) => Promise<RiotAPITypes.League.LeagueListDTO>;
        getById: ({ region, leagueId, }: {
            region: RiotAPITypes.LoLRegion;
            leagueId: string;
        }) => Promise<RiotAPITypes.League.LeagueListDTO>;
        getMasterByQueue: ({ region, queue, }: {
            region: RiotAPITypes.LoLRegion;
            queue: RiotAPITypes.QUEUE;
        }) => Promise<RiotAPITypes.League.LeagueListDTO>;
    };
    get lorMatch(): {
        getMatchIdsByPUUID: ({ region, puuid, }: {
            region: RiotAPITypes.LORCluster;
            puuid: string;
        }) => Promise<string[]>;
        getById: ({ region, matchId, }: {
            region: RiotAPITypes.LORCluster;
            matchId: string;
        }) => Promise<RiotAPITypes.LorMatch.MatchDTO>;
    };
    get lorRanked(): {
        getMasterTier: ({ region, }: {
            region: RiotAPITypes.LORCluster;
        }) => Promise<RiotAPITypes.LorRanked.LeaderboardDTO>;
    };
    get match(): {
        getIdsByTournamentCode: ({ region, tournamentCode, }: {
            region: RiotAPITypes.LoLRegion;
            tournamentCode: string;
        }) => Promise<number[]>;
        getById: ({ region, matchId, }: {
            region: RiotAPITypes.LoLRegion;
            matchId: number;
        }) => Promise<RiotAPITypes.Match.MatchDTO>;
        getByIdAndTournamentCode: ({ region, matchId, tournamentCode, }: {
            region: RiotAPITypes.LoLRegion;
            matchId: number;
            tournamentCode: string;
        }) => Promise<RiotAPITypes.Match.MatchDTO>;
        getMatchlistByAccount: ({ region, accountId, params, }: {
            region: RiotAPITypes.LoLRegion;
            accountId: string;
            params?: {
                champion?: number[] | undefined;
                queue?: number[] | undefined;
                season?: number[] | undefined;
                endTime?: number | undefined;
                beginTime?: number | undefined;
                endIndex?: number | undefined;
                beginIndex?: number | undefined;
            } | undefined;
        }) => Promise<RiotAPITypes.Match.MatchlistDTO>;
        getTimelineById: ({ region, matchId, }: {
            region: RiotAPITypes.LoLRegion;
            matchId: number;
        }) => Promise<RiotAPITypes.Match.MatchTimelineDTO>;
    };
    get matchV5(): {
        getIdsbyPuuid: ({ cluster, puuid, params, }: {
            cluster: RiotAPITypes.Cluster;
            puuid: string;
            params?: {
                queue?: number | undefined;
                type?: RiotAPITypes.MatchV5.MatchType | undefined;
                start?: number | undefined;
                count?: number | undefined;
            } | undefined;
        }) => Promise<string[]>;
        getMatchById: ({ cluster, matchId, }: {
            cluster: RiotAPITypes.Cluster;
            matchId: string;
        }) => Promise<RiotAPITypes.MatchV5.MatchDTO>;
        getMatchTimelineById: ({ cluster, matchId, }: {
            cluster: RiotAPITypes.Cluster;
            matchId: string;
        }) => Promise<RiotAPITypes.MatchV5.MatchTimelineDTO>;
    };
    get spectator(): {
        getBySummonerId: ({ region, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            summonerId: string;
        }) => Promise<RiotAPITypes.Spectator.CurrentGameInfoDTO>;
        getFeaturedGames: ({ region, }: {
            region: RiotAPITypes.LoLRegion;
        }) => Promise<RiotAPITypes.Spectator.FeaturedGamesDTO>;
    };
    get summoner(): {
        getByAccountId: ({ region, accountId, }: {
            region: RiotAPITypes.LoLRegion;
            accountId: string;
        }) => Promise<RiotAPITypes.Summoner.SummonerDTO>;
        getBySummonerName: ({ region, summonerName, }: {
            region: RiotAPITypes.LoLRegion;
            summonerName: string;
        }) => Promise<RiotAPITypes.Summoner.SummonerDTO>;
        getByPUUID: ({ region, puuid, }: {
            region: RiotAPITypes.LoLRegion;
            puuid: string;
        }) => Promise<RiotAPITypes.Summoner.SummonerDTO>;
        getBySummonerId: ({ region, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            summonerId: string;
        }) => Promise<RiotAPITypes.Summoner.SummonerDTO>;
        getByAccessToken: ({ region, accessToken, }: {
            region: RiotAPITypes.LoLRegion;
            accessToken: string;
        }) => Promise<RiotAPITypes.Summoner.SummonerDTO>;
    };
    get tftLeague(): {
        getChallenger: ({ region, }: {
            region: RiotAPITypes.LoLRegion;
        }) => Promise<RiotAPITypes.TftLeague.LeagueListDTO>;
        getEntriesBySummonerId: ({ region, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            summonerId: string;
        }) => Promise<RiotAPITypes.TftLeague.LeagueEntryDTO[]>;
        getAllEntries: ({ region, tier, division, params, }: {
            region: RiotAPITypes.LoLRegion;
            tier: RiotAPITypes.TFT_TIER;
            division: RiotAPITypes.DIVISION;
            params?: {
                page?: number | undefined;
            } | undefined;
        }) => Promise<RiotAPITypes.TftLeague.LeagueEntryDTO[]>;
        getGrandmaster: ({ region, }: {
            region: RiotAPITypes.LoLRegion;
        }) => Promise<RiotAPITypes.TftLeague.LeagueListDTO>;
        getLeagueById: ({ region, leagueId, }: {
            region: RiotAPITypes.LoLRegion;
            leagueId: string;
        }) => Promise<RiotAPITypes.TftLeague.LeagueListDTO>;
        getMaster: ({ region, }: {
            region: RiotAPITypes.LoLRegion;
        }) => Promise<RiotAPITypes.TftLeague.LeagueListDTO>;
    };
    get tftMatch(): {
        getMatchIdsByPUUID: ({ region, puuid, params, }: {
            region: RiotAPITypes.Cluster;
            puuid: string;
            params?: {
                count?: number | undefined;
            } | undefined;
        }) => Promise<string[]>;
        getById: ({ region, matchId, }: {
            region: RiotAPITypes.Cluster;
            matchId: string;
        }) => Promise<RiotAPITypes.TftMatch.MatchDTO>;
    };
    get tftSummoner(): {
        getByAccountId: ({ region, accountId, }: {
            region: RiotAPITypes.LoLRegion;
            accountId: string;
        }) => Promise<RiotAPITypes.Summoner.SummonerDTO>;
        getBySummonerName: ({ region, summonerName, }: {
            region: RiotAPITypes.LoLRegion;
            summonerName: string;
        }) => Promise<RiotAPITypes.Summoner.SummonerDTO>;
        getByPUUID: ({ region, puuid, }: {
            region: RiotAPITypes.LoLRegion;
            puuid: string;
        }) => Promise<RiotAPITypes.Summoner.SummonerDTO>;
        getBySummonerId: ({ region, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            summonerId: string;
        }) => Promise<RiotAPITypes.Summoner.SummonerDTO>;
    };
    get thirdPartyCode(): {
        getBySummonerId: ({ region, summonerId, }: {
            region: RiotAPITypes.LoLRegion;
            summonerId: string;
        }) => Promise<string>;
    };
    get tournamentStub(): {
        createCodes: ({ params, body, }: {
            params: {
                count: number;
                tournamentId: number;
            };
            body: RiotAPITypes.Tournament.TournamentCodeParametersDTO;
        }) => Promise<string[]>;
        getLobbyEventsByTournamentCode: ({ tournamentCode, }: {
            tournamentCode: string;
        }) => Promise<RiotAPITypes.Tournament.LobbyEventDTOWrapper>;
        createProvider: ({ body, }: {
            body: RiotAPITypes.Tournament.ProviderRegistrationParametersDTO;
        }) => Promise<number>;
        createTournament: ({ body, }: {
            body: RiotAPITypes.Tournament.TournamentRegistrationParametersDTO;
        }) => Promise<number>;
    };
    get tournament(): {
        createCodes: ({ params, body, }: {
            params: {
                count: number;
                tournamentId: number;
            };
            body: RiotAPITypes.Tournament.TournamentCodeParametersDTO;
        }) => Promise<string[]>;
        getByTournamentCode: ({ tournamentCode, }: {
            tournamentCode: string;
        }) => Promise<RiotAPITypes.Tournament.TournamentCodeDTO>;
        updateByTournamentCode: ({ tournamentCode, body, }: {
            tournamentCode: string;
            body: RiotAPITypes.Tournament.TournamentCodeUpdateParametersDTO;
        }) => Promise<any>;
        getLobbyEventsByTournamentCode: ({ tournamentCode, }: {
            tournamentCode: string;
        }) => Promise<RiotAPITypes.Tournament.LobbyEventDTOWrapper>;
        createProvider: ({ body, }: {
            body: RiotAPITypes.Tournament.ProviderRegistrationParametersDTO;
        }) => Promise<number>;
        createTournament: ({ body, }: {
            body: RiotAPITypes.Tournament.TournamentRegistrationParametersDTO;
        }) => Promise<number>;
    };
    get valContent(): {
        getContent: ({ region, params, }: {
            region: RiotAPITypes.VALCluster;
            params?: {
                locale?: string | undefined;
            } | undefined;
        }) => Promise<RiotAPITypes.ValContent.ContentItemDTO>;
    };
    get valMatch(): {
        getById: ({ region, matchId, }: {
            region: RiotAPITypes.VALCluster;
            matchId: string;
        }) => Promise<RiotAPITypes.ValMatch.MatchDTO>;
        getMatchlistByPUUID: ({ region, puuid, }: {
            region: RiotAPITypes.VALCluster;
            puuid: string;
        }) => Promise<RiotAPITypes.ValMatch.MatchlistDTO>;
        getRecentMatchesByQueue: ({ region, queue, }: {
            region: RiotAPITypes.VALCluster;
            queue: RiotAPITypes.VAL_QUEUE;
        }) => Promise<RiotAPITypes.ValMatch.RecentMatchesDTO>;
    };
}
