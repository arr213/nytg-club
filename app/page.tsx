"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import {GameRecord, NYTGGameLeague} from "../utils/league";


export default function Index() {

  const [records, setRecords] = useState<GameRecord[]>([]);
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
  if (league.gameRecords.length) {
    // debugger;
  }

  return (
    <div className="font-sans antialiased bg-gray-100 h-screen flex flex-col">
        {/* <!-- Header --> */}
        <div className="bg-blue-500 text-white py-4 px-8">
            <h1 className="text-2xl font-bold">The Daily Puzzler</h1>
        </div>

        {/* <!-- Main Content --> */}
        <main className="flex-grow overflow-y-auto text-black">
            {/* <!-- Weekly Scoreboard --> */}
            <section className="p-4 text-gray-600">
                <h2 className="text-xl font-semibold mb-4">Weekly Standings - {}</h2>
                <ul>
                    {/* <!-- Sample data: replace with dynamic data --> */}
                    <li className="flex justify-between items-center py-2 border-b border-gray-300">
                        <span className="font-semibold">Player 1</span>
                        <span className="font-semibold">500</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-300">
                        <span className="font-semibold">Player 2</span>
                        <span className="font-semibold">450</span>
                    </li>
                    {/* <!-- Add more players dynamically --> */}
                </ul>
            </section>

            {/* <!-- Game History --> */}
            <section className="p-4">
                {/* <!-- Sample data: replace with dynamic data --> */}
                {
                  league.games.map((game) => {
                    return (
                      <div className="flex-shrink-0 bg-white rounded-lg shadow-md p-4 mb-4" style={{minWidth: 300}} >
                        <h4 className="text-lg font-semibold mb-2 text-gray-600">{game.gameType}: {game.gameNumber}</h4>
                        <p className="font-semibold text-gray-600">{game.player}: {game.score}pts</p>
                        {game.text.split('\r\n').map(t => {
                          return <p>{t}</p>
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

