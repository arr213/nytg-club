import { DateTime } from "luxon";
import _ from "lodash";

export type GameRecord = {
  id: string;
  email: string;
  player: string;
  date: string;
  text: string;
};

export type ProcessedGameRecord = GameRecord & {
  gameNumber: number;
  gameType: string;
  gameDate: string;
  dt: DateTime;
  score: number;
  game_id: string; // `${gameType.toLowercase()}_${leftPad(gameNumber, 5, '0')}`
  win: boolean;
  error_status?: string;
}
export type GameChart = {
  [player: string]: {
    [gameType: string]: {
      [dayOfWeek: number]: number
    }
  }
}

export class NYTGGameLeague {
  league: string;
  gameRecords: GameRecord[];
  games: ProcessedGameRecord[];
  gameTypes: string[];
  dayNumbers: number[];

  constructor(gameRecords: GameRecord[]) {
    this.league = "NYTG";
    this.gameRecords = gameRecords;
    this.games = this.gameRecords.map((gr) => this.processGame(gr))
    this.gameTypes = ["Connections", "Strands", "Wordle"];
    this.dayNumbers = [7, 1, 2, 3, 4, 5, 6];
  }

  processGame(gr: GameRecord): ProcessedGameRecord {
    const gameType = gr.text.split(/\W+/)[0];
    const gameNumber = this.getGameNumber(gr);

    let dt = DateTime.fromISO(gr.date);
    if (gr.date.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      let [month, day, year] = gr.date.split('/').map(Number);
      dt = DateTime.fromObject({month, day, year});
    }

    let score = 0;
    let win = false;
    let gameDate = "";
    if (gameType === "Wordle") {

      let rows = gr.text.split(/\r\n/).filter(str => str);
      rows = rows.filter(row => !row.includes("Sent from"));
      win = rows[rows.length - 1] === "🟩🟩🟩🟩🟩"
      score = win ? 9 - rows.length : 1;
      // gameDate = 6/20/2021 + gameNumber of days since (use local timezone)
      gameDate = DateTime.fromISO("2021-06-19", {zone: "local"}).plus({days: gameNumber}).toFormat("yyyy_MM_dd");

    } else if (gameType === "Strands") {

      let rows = gr.text.split(/\r\n/).filter(str => str);
      let hintCount = this.countOccurrencesOfBulb(rows.slice(2).join(''));
      score = Math.max(5 - hintCount, 1)
      win = score > 1;
      // gameDate = 3/4/2024 + gameNumber of days since (use local timezone)
      gameDate = DateTime.fromISO("2024-03-03", {zone: "local"}).plus({days: gameNumber}).toFormat("yyyy_MM_dd");

    } else if (gameType === "Connections") {

      let rows = gr.text.split(/\r\n/).filter(str => str && !str.includes("Sent from"));
      let groups = ["🟨🟨🟨🟨","🟩🟩🟩🟩","🟦🟦🟦🟦","🟪🟪🟪🟪"];
      win = groups.every(gr => rows.includes(gr));
      score = win ? 11 - rows.length : 1;
      // gameDate = 6/12/2023 + gameNumber of days since (use local timezone)
      gameDate = DateTime.fromISO("2023-06-11", {zone: "local"}).plus({days: gameNumber}).toFormat("yyyy_MM_dd");

    }
    return {
      game_id: `${gameType.toLowerCase()}_${gameNumber.toString().padStart(5, '0')}`,
      ...gr,
      gameType,
      gameNumber,
      gameDate,
      dt,
      score,
      win
    }
  }
  
  getActiveSeasonGames(startWeekDate?: string, endWeekDate?: string) {
    const startWeekDt = startWeekDate 
      ? DateTime.fromFormat('MM-DD-YYYY', startWeekDate) 
      : DateTime.fromJSDate(new Date())
        .plus({days:1})
        .startOf('week')
        .minus({days:1});
    const endWeekDt = endWeekDate 
      ? DateTime.fromFormat('MM-DD-YYYY', endWeekDate) 
      : startWeekDt.plus({days: 6});

    const startWeekGameDate = startWeekDt.toFormat("yyyy_MM_dd");
    const endWeekGameDate = endWeekDt.toFormat("yyyy_MM_dd");

    return _.uniqBy(
      this.games
        .filter((record) => {
          return record.gameDate >= startWeekGameDate 
            && record.gameDate <= endWeekGameDate 
            && this.gameTypes.includes(record.gameType)
        })
        .sort((a, b) => {
          if (b.game_id < a.game_id){
            return 1;
          } else if (b.game_id > a.game_id){
            return -1;
          }
          return 0;
        }),
        // .sort((a, b) => b.dt.toMillis() - a.dt.toMillis()),
      (g) => `${g.game_id}_${g.player}`
    )
  }

  getLastWeekGames() {
    const startWeekDt = DateTime.fromJSDate(new Date())
      .minus({days:6})
      .startOf('week')
      .minus({days:1});
    const endWeekDt = startWeekDt.plus({days: 7});
    return this.getActiveSeasonGames(startWeekDt.toFormat('MM-DD-YYYY'), endWeekDt.toFormat('MM-DD-YYYY'));
  }

  getSeasonScoringBreakdown(startWeekDate?: string, endWeekDate?: string) {
    let scores = _.groupBy(this.getActiveSeasonGames(startWeekDate, endWeekDate), 'player');
    let playerScores = Object.keys(scores).map((player) => {
      let playerGames = scores[player];
      let wordleScore = playerGames
        .filter(game => game.gameType === "Wordle")
        .reduce((acc, game) => acc + game.score, 0);
      let strandsScore = playerGames
        .filter(game => game.gameType === "Strands")
        .reduce((acc, game) => acc + game.score, 0);
      let connectionsScore = playerGames
        .filter(game => game.gameType === "Connections")
        .reduce((acc, game) => acc + game.score, 0);
      return { player, wordleScore, strandsScore, connectionsScore }
    }).sort((a, b) => b.wordleScore - a.wordleScore);
    return playerScores;
  }

  getSeasonPlayers() {
    return _.uniq(this.getActiveSeasonGames().map((game) => game.player));
  }

  getSeasonScoringChart(startWeekDate?: string, endWeekDate?: string): GameChart {
    // Build a nested object that has the the score stored at chart[player][gameType][dayOfWeek]
    let chart = {} as GameChart;
    let scores = _.groupBy(this.getActiveSeasonGames(startWeekDate, endWeekDate), 'player');
    for (let player in scores) {
      chart[player] = { Wordle: {}, Strands: {}, Connections: {} };
      scores[player].forEach((game) => {
        if (!game.gameType) return;
        try {
          let dayOfWeek = DateTime.fromFormat(game.gameDate, "yyyy_MM_dd").weekday;
          if (!chart[player][game.gameType][dayOfWeek]) {
            chart[player][game.gameType][dayOfWeek] =0;
          }
          chart[player][game.gameType][dayOfWeek] += game.score;
        } catch(e) {
          console.log("Error processing game", game, e);
        }
      });
    }

    return chart;
  }

  countOccurrencesOfBulb(str: string) {
    let count = 0;
    for (let char of str) if (char === "💡") count++;
    return count;
  }

  getSeasonScores() {
    const games = this.getActiveSeasonGames();
    let scores = _.groupBy(games, 'player');
    let playerScores = Object.keys(scores).map((player) => {
      let playerGames = scores[player];
      let playerScore = playerGames.reduce((acc, game) => acc + game.score, 0);
      return { player, playerScore, playerGames }
    }).sort((a, b) => b.playerScore - a.playerScore);
    return playerScores;
  }


  getSeasonDates() {
    const startWeekDt = DateTime
      .fromJSDate(new Date())
      .plus({days: 1})
      .startOf('week')
      .minus({days: 1});
    const endWeekDt = startWeekDt.plus({days: 6});
    return [startWeekDt.toFormat('LLL dd'), endWeekDt.toFormat('LLL dd')]
  }

  getGameNumber(record: GameRecord) {
      const gameType = record.text.split(/\W+/)[0];

      if (gameType === "Wordle") {
        const score = Number(record.text.split(' ')[1].replace(/,/g, ''));
        if (!isNaN(score)) return score;
      }
      if (gameType === "Strands") {
        const regex = new RegExp(`${gameType}\\s+#?(\\d+)`);
        const match = record.text.match(regex);
        if (match && !isNaN(Number(match[1]))) return Number(match[1]);
      }
      if (gameType === "Connections") {
        const match = record.text.match(/#(\d+)/);
        if (match && !isNaN(Number(match[1]))) return Number(match[1]);
      }
      return 0;
  }

  gamesByDateAndType() {
    // return a nested object with the games grouped by date then by gameType
    // There will be a list of games for each date and gameType
    let gamesByDateAndType: { [date: string]: { [gameType: string]: ProcessedGameRecord[] } } = {};
    for (let game of this.getActiveSeasonGames()) {
      if (!gamesByDateAndType[game.gameDate]) {
        gamesByDateAndType[game.gameDate] = {};
      }
      if (!gamesByDateAndType[game.gameDate][game.gameType]) {
        gamesByDateAndType[game.gameDate][game.gameType] = [];
      }
      gamesByDateAndType[game.gameDate][game.gameType].push(game);
    }
    return gamesByDateAndType;
  }


}

