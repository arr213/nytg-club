import { DateTime } from "luxon";

export type GameRecord = {
  id: string;
  email: string;
  player: string;
  date: string;
  text: string;
  game: string;
  dt: DateTime;
};

export class NYTGGameLeague {
  league: string;
  gameRecords: GameRecord[];

  constructor(gameRecords: GameRecord[]) {
    this.league = "NYTG";
    this.gameRecords = gameRecords;
  }
  
  getActiveSeasonGames(startWeekDate?: string, endWeekDate?: string) {
    const startWeekDt = startWeekDate ? DateTime.fromFormat('MM-DD-YYYY', startWeekDate) : DateTime.fromISO(new Date().toISOString());
    const endWeekDt = endWeekDate || startWeekDt.plus({days: 7});
    this.gameRecords.filter((record) => {
      return record.dt >= startWeekDt && record.dt <= endWeekDt;
    })
    
  }

}

