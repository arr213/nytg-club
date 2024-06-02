Given the records below, I am writing a typescript method processGame shown below.

I would like help editing and completing the processGame method shown below.
Notes:
    gameNumber: I need to fix the definition of gameNumber so that it correctly gets the number for all types of games.
    win: the win conditions for each type are as follows.
        Wordle: Win if the last line of emojis are all green.
        Strands: Strands will always be a win (true)
        Connections: Win if there is a full line of 4 matching color emojis for each of the 4 colors.
    score: The score conditions for each game type are as follows:
        Wordle: 
            - In the case of a loss, score 1 point
            - 

    


The current file is shown below:
```import { DateTime } from "luxon";

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
  games?: ProcessedGameRecord[];


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

    return {
      ...gr,
      gameType,
      gameNumber,
      dt
    }
  }


  
  getActiveSeasonGames(startWeekDate?: string, endWeekDate?: string) {
    const startWeekDt = startWeekDate ? DateTime.fromFormat('MM-DD-YYYY', startWeekDate) : DateTime.fromISO(new Date().toISOString());
    const endWeekDt = endWeekDate || startWeekDt.plus({days: 7});
    this.gameRecords.filter((record) => {
      return record.dt >= startWeekDt && record.dt <= endWeekDt;
    })
    
  }

}

```

The sample records below:
[
    {
        "id": 1,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/28/2024",
        "text": "Connections\r\nPuzzle #318\r\n🟪🟨🟩🟨\r\n🟩🟩🟩🟩\r\n🟦🟦🟦🟦\r\n🟨🟨🟨🟨\r\n🟪🟪🟪🟪\r\n"
    },
    {
        "id": 2,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/28/2024",
        "text": "Wordle 1,044 5/6*\r\n\r\n⬛⬛⬛🟨🟩\r\n⬛🟩⬛🟨🟩\r\n🟩🟩⬛⬛🟩\r\n🟩🟩🟩⬛🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 3,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/28/2024",
        "text": "Connections\r\nPuzzle #322\r\n🟦🟦🟦🟦\r\n🟩🟩🟩🟩\r\n🟪🟪🟪🟪\r\n🟨🟨🟨🟨\r\n"
    },
    {
        "id": 4,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/28/2024",
        "text": "Strands #56\r\n“Coming clean”\r\n🔵🔵🔵🔵\r\n🟡🔵🔵\r\n"
    },
    {
        "id": 5,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/30/2024",
        "text": "Wordle 1,045 5/6*\r\n\r\n⬛🟨🟩🟨⬛\r\n🟨🟩🟩⬛⬛\r\n⬛🟩🟩⬛🟩\r\n⬛🟩🟩🟩🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 6,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/30/2024",
        "text": "Connections\r\nPuzzle #323\r\n🟪🟩🟦🟪\r\n🟩🟩🟩🟩\r\n🟨🟨🟨🟨\r\n🟪🟪🟪🟪\r\n🟦🟦🟦🟦\r\n"
    },
    {
        "id": 7,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/30/2024",
        "text": "Strands #57\r\n“Name dropping”\r\n🔵🔵🔵🔵\r\n🟡🔵🔵🔵\r\n"
    },
    {
        "id": 8,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/30/2024",
        "text": "Connections\r\nPuzzle #324\r\n🟦🟦🟦🟦\r\n🟩🟩🟩🟩\r\n🟨🟪🟨🟨\r\n🟪🟨🟨🟨\r\n🟨🟨🟨🟨\r\n🟪🟪🟪🟪\r\n"
    },
    {
        "id": 9,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/1/2024",
        "text": "Wordle 1,047 3/6*\r\n\r\n⬛⬛🟩🟩⬛\r\n⬛⬛🟩🟩⬛\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 10,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/2/2024",
        "text": "Wordle 1,048 5/6*\r\n\r\n🟩⬛⬛⬛🟩\r\n🟩⬛🟩⬛🟩\r\n🟩🟩🟩⬛🟩\r\n🟩🟩🟩⬛🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 11,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/5/2024",
        "text": "Connections\r\nPuzzle #329\r\n🟪🟪🟪🟪\r\n🟩🟩🟩🟩\r\n🟨🟦🟨🟨\r\n🟨🟨🟨🟨\r\n🟦🟦🟦🟦\r\n"
    },
    {
        "id": 12,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/5/2024",
        "text": "Strands #63\r\n“Tools for the job”\r\n🔵🔵🔵🔵\r\n🔵🟡🔵🔵\r\n"
    },
    {
        "id": 13,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/5/2024",
        "text": "Wordle 1,051 4/6*\r\n\r\n⬛⬛🟨⬛🟨\r\n🟨🟨🟨🟩⬛\r\n⬛🟩🟩🟩🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 14,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/7/2024",
        "text": "Strands #65\r\n“Can you dig it?”\r\n🔵💡🔵🔵\r\n🔵🔵🟡🔵\r\n"
    },
    {
        "id": 15,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/7/2024",
        "text": "Connections\r\nPuzzle #331\r\n🟨🟨🟨🟨\r\n🟦🟪🟩🟦\r\n🟦🟩🟦🟦\r\n🟩🟦🟩🟦\r\n🟦🟦🟪🟦\r\n"
    },
    {
        "id": 16,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/7/2024",
        "text": "Wordle 1,053 6/6*\r\n\r\n🟨🟨⬛⬛⬛\r\n🟨⬛⬛⬛🟨\r\n⬛🟩🟩🟩🟩\r\n⬛🟩🟩🟩🟩\r\n⬛🟩🟩🟩🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 17,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/9/2024",
        "text": "Connections\r\nPuzzle #333\r\n🟨🟦🟨🟨\r\n🟪🟪🟪🟪\r\n🟩🟨🟦🟨\r\n🟨🟨🟨🟨\r\n🟩🟩🟩🟩\r\n🟦🟦🟦🟦\r\n"
    },
    {
        "id": 18,
        "email": "william.lesser@gmail.com",
        "player": "William Lesser",
        "date": "5/10/2024",
        "text": "Wordle 1,056 4/6\r\n\r\n⬜⬜🟨⬜🟨\r\n⬜🟩🟨⬜⬜\r\n🟩🟩🟩🟨⬜\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 19,
        "email": "william.lesser@gmail.com",
        "player": "William Lesser",
        "date": "5/10/2024",
        "text": "Connections\r\nPuzzle #334\r\n🟦🟦🟩🟨\r\n🟦🟪🟦🟦\r\n🟦🟦🟦🟦\r\n🟨🟨🟩🟨\r\n🟨🟨🟨🟨\r\n🟩🟩🟩🟩\r\n🟪🟪🟪🟪\r\n"
    },
    {
        "id": 20,
        "email": "william.lesser@gmail.com",
        "player": "William Lesser",
        "date": "5/10/2024",
        "text": "Strands #68\r\n“Like a rocket”\r\n🔵🔵🟡🔵\r\n🔵🔵\r\n"
    },
    {
        "id": 21,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/10/2024",
        "text": "Connections\r\nPuzzle #334\r\n🟪🟩🟨🟨\r\n🟨🟨🟨🟨\r\n🟩🟦🟦🟦\r\n🟪🟩🟪🟪\r\n🟦🟪🟪🟪\r\n"
    },
    {
        "id": 22,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/10/2024",
        "text": "Connections\r\nPuzzle #334\r\n🟪🟩🟨🟨\r\n🟨🟨🟨🟨\r\n🟩🟦🟦🟦\r\n🟪🟩🟪🟪\r\n🟦🟪🟪🟪\r\n"
    }
]