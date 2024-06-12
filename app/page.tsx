"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import {GameRecord, NYTGGameLeague} from "../utils/league";

type GameFilter = {
  gameType?: string;
  player?: string;
  date?: string;
}

export default function Index() {

  const [records, setRecords] = useState<GameRecord[]>([]);
  const [filters, setFilters] = useState<{}>({});
  useEffect(() => {
    // Your code here
    fetch("https://arr213-azureZebra.web.val.run/")
      .then((response) => response.json())
      .then((data) => {
        const recs = data.map((record: string[]): GameRecord => {
          const [id, email, player, date, text] = record;
          return { id, email, player, date, text };
        });
        setRecords(recs);
      });
  }, []);

  const league = new NYTGGameLeague(records);
  // if (league.games.length) {
  //   let activeGames = league.getActiveSeasonGames();
  //   let scores = league.getSeasonScores(); --
  //   debugger;
  // }

  return (
    <div className="font-sans antialiased bg-gray-100 h-screen flex flex-col w-dvw overflow-y-auto">
        {/* <!-- Header --> */}
        <div className="bg-black text-white py-4 px-8 lg:text-center">
            <h1 className="text-2xl font-bold">The Daily Puzzler</h1>
        </div>

        {/* <!-- Main Content --> */}
        <main className="flex-grow text-black md:w-1/2 mx-auto lg:w-1/3">
            {/* <!-- Weekly Scoreboard --> */}
            <section className="p-4 text-gray-600 text-center">
                <h2 className="text-xl font-semibold mb-2">Weekly Standings</h2>
                <h3 className="text-lg font-semibold mb-2 ml-4">{league.getSeasonDates()[0]} - {league.getSeasonDates()[1]}</h3>
                <ul className="md:w-50">
                    {league.getSeasonScores().map((score) => {
                      return (
                        <li key={score.player} className="flex justify-between items-center py-2 border-b border-gray-300">
                            <span className="font-semibold">{score.player}</span>
                            <span className="font-semibold">{score.playerScore}</span>
                        </li>
                      );
                    })}
                </ul>
            </section>

            {/* <!-- Game History --> */}
            <section className="p-4 text-gray-600">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-center">Game Records</h2>
                </div>
                
                {/* <!-- Sample data: replace with dynamic data --> */}
                {
                  league.getActiveSeasonGames().map((game) => {
                    return (
                      <div key={game.gameType + game.player + game.gameNumber} className="flex-shrink-0 bg-white rounded-lg shadow-md p-4 mb-4" >
                        <h4 className="text-lg font-semibold mb-2 text-gray-600">{game.gameType}: {game.gameNumber} - {DateTime.fromObject({month: Number(game.date.split('/')[0]),
      day: Number(game.date.split('/')[1]),
      year: Number(game.date.split('/')[2])}).toFormat('ccc LLL d')}</h4>
                        {/* DateTime.fromFormat(game.date, 'MM/DD/YYYY').toFormat('ccc LLL d') */}
                        <p className="font-semibold text-gray-600">{game.player}: {game.score}pts</p>
                        {game.text.split('\r\n').map((t, idx) => {
                          return <p key={`${t}_${idx}_${game.game_id}`}>{t}</p>
                        })}
                      </div>
                    );
                  })
                }
                {/* <!-- Add more date sections dynamically --> */}
            </section>
        </main>
    </div>
  );
}

