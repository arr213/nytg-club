import { DateTime } from "luxon";

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
  score?: number;
  game_id?: string; // `${gameType.toLowercase()}_${leftPad(gameNumber, 5, '0')}`
  win?: boolean;
  error_status?: string;
}

export class NYTGGameLeague {
  league: string;
  gameRecords: GameRecord[];
  games: ProcessedGameRecord[];


  constructor(gameRecords: GameRecord[]) {
    this.league = "NYTG";
    this.gameRecords = gameRecords;
    this.games = this.gameRecords.map((gr) => this.processGame(gr))
  }

  processGame(gr: GameRecord): ProcessedGameRecord {
    const gameType = gr.text.split(/\W+/)[0];
    const gameNumber = Number(gr.text.split(/\W+/));
    const dt = DateTime.fromObject({
      month: Number(gr.date.split('/')[0]),
      day: Number(gr.date.split('/')[1]),
      year: Number(gr.date.split('/')[2])
    });
    let score = 0;
    let win = false;
    if (gameType === "Wordle") {
      let rows = gr.text.split(/\r\n/).filter(str => str);
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
      ...gr,
      gameType,
      gameNumber,
      dt,
      score,
      win
    }
  }
  
  getActiveSeasonGames(startWeekDate?: string, endWeekDate?: string) {
    const startWeekDt = startWeekDate ? DateTime.fromFormat('MM-DD-YYYY', startWeekDate) : DateTime.fromISO(new Date().toISOString());
    const endWeekDt = endWeekDate || startWeekDt.plus({days: 7});
    this.games.filter((record) => {
      return record.dt >= startWeekDt && record.dt <= endWeekDt;
    })
    
  }

  countOccurrencesOfBulb(str: string) {
    let count = 0;
    for (let char of str) {
        if (char === "💡") count++;
    }
    return count;
  }

  connectionsWin(rows: string[]) {
    
    let groups = ["🟨🟨🟨🟨","🟩🟩🟩🟩","🟦🟦🟦🟦","🟪🟪🟪🟪"];
    groups.every(gr => rows.includes(gr));
  }

}

