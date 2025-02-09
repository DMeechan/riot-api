"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiotAPI = exports.DDragon = exports.PlatformId = exports.RiotAPITypes = void 0;
const riot_rate_limiter_1 = require("@fightmegg/riot-rate-limiter");
Object.defineProperty(exports, "PlatformId", { enumerable: true, get: function () { return riot_rate_limiter_1.PlatformId; } });
const query_string_1 = __importDefault(require("query-string"));
const path_to_regexp_1 = require("path-to-regexp");
const _types_1 = require("./@types");
Object.defineProperty(exports, "RiotAPITypes", { enumerable: true, get: function () { return _types_1.RiotAPITypes; } });
const cache_1 = require("./cache");
const ddragon_1 = require("./ddragon");
Object.defineProperty(exports, "DDragon", { enumerable: true, get: function () { return ddragon_1.DDragon; } });
const debugCache = require("debug")("riotapi:cache");
const createHost = path_to_regexp_1.compile(riot_rate_limiter_1.HOST, { encode: encodeURIComponent });
const getPath = (key) => {
    let path = riot_rate_limiter_1.METHODS;
    key.split(".").forEach((p) => {
        path = path[p];
    });
    return path;
};
class RiotAPI {
    constructor(token, config = {}) {
        var _a, _b;
        this.config = {
            debug: false,
        };
        if (!token)
            throw new Error("token is missing");
        this.token = token;
        this.config = { ...this.config, ...config };
        this.riotRateLimiter = new riot_rate_limiter_1.RiotRateLimiter({
            concurrency: 10,
            datastore: ((_a = this.config.cache) === null || _a === void 0 ? void 0 : _a.cacheType) || "local",
        });
        this.ddragon = new ddragon_1.DDragon();
        if (((_b = this.config.cache) === null || _b === void 0 ? void 0 : _b.cacheType) === "local")
            this.cache = new cache_1.MemoryCache();
    }
    getHeaders(headers) {
        return headers || { "X-Riot-Token": this.token };
    }
    getOptions({ body, method, headers, } = {}) {
        return {
            headers: this.getHeaders(headers),
            body: body ? JSON.stringify(body) : undefined,
            method,
        };
    }
    getJobOptions({ id, priority, expiration, } = { id: new Date().toString() }) {
        return { id, priority, expiration };
    }
    async checkCache(key, url) {
        var _a, _b;
        if (this.cache && ((_b = (_a = this.config.cache) === null || _a === void 0 ? void 0 : _a.ttls) === null || _b === void 0 ? void 0 : _b.byMethod[key])) {
            const cacheValue = (await this.cache.get(url));
            if (cacheValue)
                debugCache("Cache Hit", key, url);
            return cacheValue;
        }
        return null;
    }
    async setCache(key, url, data) {
        var _a, _b;
        if (this.cache && ((_b = (_a = this.config.cache) === null || _a === void 0 ? void 0 : _a.ttls) === null || _b === void 0 ? void 0 : _b.byMethod[key])) {
            debugCache("Setting", key, url, this.config.cache.ttls.byMethod[key]);
            await this.cache.set(url, data, this.config.cache.ttls.byMethod[key]);
        }
    }
    async request(platformId, methodKey, pathData, options) {
        const path = getPath(methodKey);
        const createPath = path_to_regexp_1.compile(path, { encode: encodeURIComponent });
        let url = `https://${createHost({ platformId })}${createPath(pathData)}`;
        if (options === null || options === void 0 ? void 0 : options.params)
            url += `?${query_string_1.default.stringify(options.params)}`;
        const cacheValue = await this.checkCache(methodKey, url);
        if (cacheValue)
            return cacheValue;
        const resp = await this.riotRateLimiter.execute({ url, options: this.getOptions(options) }, this.getJobOptions(options));
        await this.setCache(methodKey, url, resp);
        return resp;
    }
    get account() {
        return {
            getByPUUID: ({ region, puuid, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.ACCOUNT.GET_BY_PUUID, { puuid }, { id: `${region}.account.getByPUUID.${puuid}`, priority: 4 }),
            getByRiotId: ({ region, gameName, tagLine, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.ACCOUNT.GET_BY_RIOT_ID, { gameName, tagLine }, {
                id: `${region}.account.getByRiotId.${gameName}.${tagLine}`,
                priority: 4,
            }),
            getActiveShardForPlayer: ({ region, game, puuid, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.ACCOUNT.GET_ACTIVE_SHARD_FOR_PLAYER, { game, puuid }, { id: `${region}.account.getActiveShardForPlayer.${game}.${puuid}` }),
        };
    }
    get championMastery() {
        return {
            getAllChampions: ({ region, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.CHAMPION_MASTERY.GET_ALL_CHAMPIONS, { summonerId }, { id: `${region}.championMastery.getAllChampions.${summonerId}` }),
            getChampion: ({ region, championId, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.CHAMPION_MASTERY.GET_CHAMPION_MASTERY, { championId, summonerId }, {
                id: `${region}.championMastery.getChampion.${championId}.${summonerId}`,
            }),
            getMasteryScore: ({ region, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.CHAMPION_MASTERY.GET_CHAMPION_MASTERY_SCORE, { summonerId }, { id: `${region}.championMastery.getMasteryScore.${summonerId}` }),
        };
    }
    get champion() {
        return {
            getRotations: ({ region, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.CHAMPION.GET_CHAMPION_ROTATIONS, {}, { id: `${region}.champion.getRotations` }),
        };
    }
    get clash() {
        return {
            getPlayersBySummonerId: ({ region, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.CLASH.GET_PLAYERS_BY_SUMMONER, { summonerId }, { id: `${region}.clash.getPlayersBySummonerId.${summonerId}` }),
            getTeamById: ({ region, teamId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.CLASH.GET_TEAM, { teamId }, { id: `${region}.clash.getTeamById.${teamId}` }),
            getTournaments: ({ region, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.CLASH.GET_TOURNAMENTS, {}, { id: `${region}.clash.getTournaments` }),
            getTournamentById: ({ region, tournamentId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.CLASH.GET_TOURNAMENT, { tournamentId }, { id: `${region}.clash.getTournamentById.${tournamentId}` }),
            getTournamentByTeamId: ({ region, teamId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.CLASH.GET_TOURNAMENT_TEAM, { teamId }, { id: `${region}.clash.getTournamentByTeamId.${teamId}` }),
        };
    }
    get leagueExp() {
        return {
            getLeagueEntries: ({ region, queue, tier, division, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LEAGUE_EXP.GET_LEAGUE_ENTRIES, { queue, tier, division }, {
                id: `${region}.leagueExp.getLeagueEntries.${queue}.${tier}.${division}`,
            }),
        };
    }
    get league() {
        return {
            getChallengerByQueue: ({ region, queue, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LEAGUE.GET_CHALLENGER_BY_QUEUE, { queue }, {
                id: `${region}.league.getChallengerByQueue.${queue}`,
            }),
            getEntriesBySummonerId: ({ region, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LEAGUE.GET_ENTRIES_BY_SUMMONER, { summonerId }, {
                id: `${region}.league.getEntriesBySummonerId.${summonerId}`,
            }),
            getAllEntries: ({ region, queue, tier, division, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LEAGUE.GET_ALL_ENTRIES, { queue, tier, division }, {
                id: `${region}.league.getAllEntries.${queue}.${tier}.${division}`,
            }),
            getGrandmasterByQueue: ({ region, queue, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LEAGUE.GET_GRANDMASTER_BY_QUEUE, { queue }, {
                id: `${region}.league.getGrandmasterByQueue.${queue}`,
            }),
            getById: ({ region, leagueId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LEAGUE.GET_LEAGUE_BY_ID, { leagueId }, {
                id: `${region}.league.getById.${leagueId}`,
            }),
            getMasterByQueue: ({ region, queue, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LEAGUE.GET_MASTER_BY_QUEUE, { queue }, {
                id: `${region}.league.getMasterByQueue.${queue}`,
            }),
        };
    }
    get lorMatch() {
        return {
            getMatchIdsByPUUID: ({ region, puuid, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LOR_MATCH.GET_MATCH_IDS_BY_PUUID, { puuid }, { id: `${region}.lorMatch.getMatchIdsByPUUID.${puuid}` }),
            getById: ({ region, matchId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LOR_MATCH.GET_MATCH_BY_ID, { matchId }, { id: `${region}.lorMatch.getById.${matchId}` }),
        };
    }
    get lorRanked() {
        return {
            getMasterTier: ({ region, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.LOR_RANKED.GET_MASTER_TIER, {}, { id: `${region}.lorRanked.getMasterTier` }),
        };
    }
    get match() {
        return {
            getIdsByTournamentCode: ({ region, tournamentCode, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.MATCH.GET_IDS_BY_TOURNAMENT_CODE, { tournamentCode }, { id: `${region}.match.getIdsByTournamentCode.${tournamentCode}` }),
            getById: ({ region, matchId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.MATCH.GET_MATCH_BY_ID, { matchId }, { id: `${region}.match.getById.${matchId}` }),
            getByIdAndTournamentCode: ({ region, matchId, tournamentCode, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.MATCH.GET_MATCH_BY_ID_AND_TOURNAMENT_CODE, { matchId, tournamentCode }, {
                id: `${region}.match.getByIdAndTournamentCode.${matchId}.${tournamentCode}`,
            }),
            getMatchlistByAccount: ({ region, accountId, params, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.MATCH.GET_MATCHLIST_BY_ACCOUNT, { accountId }, {
                id: `${region}.match.getMatchlistByAccount.${accountId}`,
                params,
            }),
            getTimelineById: ({ region, matchId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.MATCH.GET_TIMELINE_BY_MATCH_ID, { matchId }, {
                id: `${region}.match.getTimelineById.${matchId}`,
            }),
        };
    }
    get matchV5() {
        return {
            getIdsbyPuuid: ({ cluster, puuid, params, }) => this.request(cluster, _types_1.RiotAPITypes.METHOD_KEY.MATCH_V5.GET_IDS_BY_PUUID, { puuid }, {
                id: `${cluster}.matchv5.getIdsByPuuid.${puuid}`,
                params,
            }),
            getMatchById: ({ cluster, matchId, }) => this.request(cluster, _types_1.RiotAPITypes.METHOD_KEY.MATCH_V5.GET_MATCH_BY_ID, { matchId }, {
                id: `${cluster}.matchv5.getMatchById.${matchId}`,
            }),
            getMatchTimelineById: ({ cluster, matchId, }) => this.request(cluster, _types_1.RiotAPITypes.METHOD_KEY.MATCH_V5.GET_MATCH_TIMELINE_BY_ID, { matchId }, {
                id: `${cluster}.matchv5.getMatchTimelineById.${matchId}`,
            }),
        };
    }
    get spectator() {
        return {
            getBySummonerId: ({ region, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.SPECTATOR.GET_GAME_BY_SUMMONER_ID, { summonerId }, { id: `${region}.spectator.getBySummonerId.${summonerId}` }),
            getFeaturedGames: ({ region, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.SPECTATOR.GET_FEATURED_GAMES, {}, { id: `${region}.spectator.getFeaturedGames` }),
        };
    }
    get summoner() {
        return {
            getByAccountId: ({ region, accountId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.SUMMONER.GET_BY_ACCOUNT_ID, { accountId }, { id: `${region}.summoner.getByAccountId.${accountId}` }),
            getBySummonerName: ({ region, summonerName, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.SUMMONER.GET_BY_SUMMONER_NAME, { summonerName }, { id: `${region}.summoner.getBySummonerName.${summonerName}` }),
            getByPUUID: ({ region, puuid, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.SUMMONER.GET_BY_PUUID, { puuid }, { id: `${region}.summoner.getByPUUID.${puuid}` }),
            getBySummonerId: ({ region, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.SUMMONER.GET_BY_SUMMONER_ID, { summonerId }, { id: `${region}.summoner.getBySummonerId.${summonerId}` }),
            getByAccessToken: ({ region, accessToken, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.SUMMONER.GET_BY_ACCESS_TOKEN, {}, {
                id: `${region}.summoner.getByAccessToken`,
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        };
    }
    get tftLeague() {
        return {
            getChallenger: ({ region, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_LEAGUE.GET_CHALLENGER, {}, { id: `${region}.tftLeague.getChallenger` }),
            getEntriesBySummonerId: ({ region, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_LEAGUE.GET_ENTRIES_BY_SUMMONER, { summonerId }, { id: `${region}.tftLeague.getEntriesBySummonerId.${summonerId}` }),
            getAllEntries: ({ region, tier, division, params, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_LEAGUE.GET_ALL_ENTRIES, { tier, division }, {
                id: `${region}.tftLeague.getAllEntries.${tier}.${division}`,
                params,
            }),
            getGrandmaster: ({ region, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_LEAGUE.GET_GRANDMASTER, {}, { id: `${region}.tftLeague.getGrandmaster` }),
            getLeagueById: ({ region, leagueId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_LEAGUE.GET_LEAGUE_BY_ID, { leagueId }, { id: `${region}.tftLeague.getLeagueById.${leagueId}` }),
            getMaster: ({ region, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_LEAGUE.GET_MASTER, {}, { id: `${region}.tftLeague.getMaster` }),
        };
    }
    get tftMatch() {
        return {
            getMatchIdsByPUUID: ({ region, puuid, params, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_MATCH.GET_MATCH_IDS_BY_PUUID, { puuid }, { id: `${region}.tftMatch.getMatchIdsByPUUID.${puuid}`, params }),
            getById: ({ region, matchId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_MATCH.GET_MATCH_BY_ID, { matchId }, { id: `${region}.tftMatch.getById.${matchId}` }),
        };
    }
    get tftSummoner() {
        return {
            getByAccountId: ({ region, accountId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_SUMMONER.GET_BY_ACCOUNT_ID, { accountId }, { id: `${region}.tftSummoner.getByAccountId.${accountId}` }),
            getBySummonerName: ({ region, summonerName, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_SUMMONER.GET_BY_SUMMONER_NAME, { summonerName }, { id: `${region}.tftSummoner.getBySummonerName.${summonerName}` }),
            getByPUUID: ({ region, puuid, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_SUMMONER.GET_BY_PUUID, { puuid }, { id: `${region}.tftSummoner.getByPUUID.${puuid}` }),
            getBySummonerId: ({ region, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.TFT_SUMMONER.GET_BY_SUMMONER_ID, { summonerId }, { id: `${region}.tftSummoner.getBySummonerId.${summonerId}` }),
        };
    }
    get thirdPartyCode() {
        return {
            getBySummonerId: ({ region, summonerId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.THIRD_PARTY_CODE.GET_BY_SUMMONER_ID, { summonerId }, { id: `${region}.thirdPartyCode.getBySummonerId.${summonerId}` }),
        };
    }
    get tournamentStub() {
        return {
            createCodes: ({ params, body, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT_STUB.POST_CREATE_CODES, {}, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournamentStub.createCodes.${params.tournamentId}`,
                params,
                body,
                method: "POST",
            }),
            getLobbyEventsByTournamentCode: ({ tournamentCode, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT_STUB
                .GET_LOBBY_EVENTS_BY_TOURNAMENT_CODE, { tournamentCode }, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournamentStub.getLobbyEventsByTournamentCode.${tournamentCode}`,
            }),
            createProvider: ({ body, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT_STUB.POST_CREATE_PROVIDER, {}, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournamentStub.createProvider`,
                body,
                method: "POST",
            }),
            createTournament: ({ body, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT_STUB.POST_CREATE_TOURNAMENT, {}, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournamentStub.createTournament`,
                body,
                method: "POST",
            }),
        };
    }
    get tournament() {
        return {
            createCodes: ({ params, body, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT.POST_CREATE_CODES, {}, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournament.createCodes.${params.tournamentId}`,
                priority: 0,
                params,
                body,
                method: "POST",
            }),
            getByTournamentCode: ({ tournamentCode, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT.GET_TOURNAMENT_BY_CODE, { tournamentCode }, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournament.getByTournamentCode.${tournamentCode}`,
                priority: 0,
            }),
            updateByTournamentCode: ({ tournamentCode, body, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT.GET_TOURNAMENT_BY_CODE, { tournamentCode }, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournament.updateByTournamentCode.${tournamentCode}`,
                priority: 0,
                body,
                method: "POST",
            }),
            getLobbyEventsByTournamentCode: ({ tournamentCode, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT
                .GET_LOBBY_EVENTS_BY_TOURNAMENT_CODE, { tournamentCode }, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournament.getLobbyEventsByTournamentCode.${tournamentCode}`,
                priority: 0,
            }),
            createProvider: ({ body, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT.POST_CREATE_PROVIDER, {}, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournament.createProvider`,
                priority: 0,
                body,
                method: "POST",
            }),
            createTournament: ({ body, }) => this.request(riot_rate_limiter_1.PlatformId.AMERICAS, _types_1.RiotAPITypes.METHOD_KEY.TOURNAMENT.POST_CREATE_TOURNAMENT, {}, {
                id: `${riot_rate_limiter_1.PlatformId.AMERICAS}.tournament.createTournament`,
                priority: 0,
                body,
                method: "POST",
            }),
        };
    }
    get valContent() {
        return {
            getContent: ({ region, params, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.VAL_CONTENT.GET_CONTENT, {}, { id: `${region}.valContent.getContent`, params }),
        };
    }
    get valMatch() {
        return {
            getById: ({ region, matchId, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.VAL_MATCH.GET_MATCH_BY_ID, { matchId }, { id: `${region}.valMatch.getById.${matchId}` }),
            getMatchlistByPUUID: ({ region, puuid, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.VAL_MATCH.GET_MATCHLIST_BY_PUUID, { puuid }, { id: `${region}.valMatch.getMatchlistByPUUID.${puuid}` }),
            getRecentMatchesByQueue: ({ region, queue, }) => this.request(region, _types_1.RiotAPITypes.METHOD_KEY.VAL_MATCH.GET_RECENT_MATCHES_BY_QUEUE, { queue }, { id: `${region}.valMatch.getRecentMatchesByQueue.${queue}` }),
        };
    }
}
exports.RiotAPI = RiotAPI;
