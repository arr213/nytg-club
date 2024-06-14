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
  dt: DateTime;
  score: number;
  game_id: string; // `${gameType.toLowercase()}_${leftPad(gameNumber, 5, '0')}`
  win: boolean;
  error_status?: string;
}

export class NYTGGameLeague {
  league: string;
  gameRecords: GameRecord[];
  games: ProcessedGameRecord[];
  gameTypes: string[];

  constructor(gameRecords: GameRecord[]) {
    this.league = "NYTG";
    this.gameRecords = gameRecords;
    this.games = this.gameRecords.map((gr) => this.processGame(gr))
    this.gameTypes = ["Connections", "Strands", "Wordle"];
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
    if (gameType === "Wordle") {
      let rows = gr.text.split(/\r\n/).filter(str => str);
      if (rows[rows.length - 1].includes("Sent from")) rows.pop();
      win = rows[rows.length - 1] === "🟩🟩🟩🟩🟩"
      score = win ? 9 - rows.length : 1;
    } else if (gameType === "Strands") {
      let rows = gr.text.split(/\r\n/).filter(str => str);
      let hintCount = this.countOccurrencesOfBulb(rows.slice(2).join(''));
      score = Math.max(5 - hintCount, 1)
      win = score > 1;
    } else if (gameType === "Connections") {
      let rows = gr.text.split(/\r\n/).filter(str => str);
      let groups = ["🟨🟨🟨🟨","🟩🟩🟩🟩","🟦🟦🟦🟦","🟪🟪🟪🟪"];
      win = groups.every(gr => rows.includes(gr));
      score = win ? 11 - rows.length : 1;
    }
    return {
      game_id: `${gameType.toLowerCase()}_${gameNumber.toString().padStart(5, '0')}`,
      ...gr,
      gameType,
      gameNumber,
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
      : startWeekDt.plus({days: 7});
    return _.uniqBy(
      this.games
        .filter((record) => record.dt >= startWeekDt && record.dt <= endWeekDt)
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
      let wordleScore = playerGames
        .filter(game => game.gameType === "Wordle")
        .reduce((acc, game) => acc + game.score, 0);
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
    const endWeekDt = startWeekDt.plus({days: 7});
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


}

