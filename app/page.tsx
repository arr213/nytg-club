"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import {GameRecord, NYTGGameLeague, ProcessedGameRecord} from "../utils/league";
import _ from "lodash";
import {
  Accordion, 
  AccordionActions, 
  AccordionSummary, 
  AccordionDetails,
  Modal
} from '@mui/material';
import {Info, ExpandMore, Close} from '@mui/icons-material';

import PlayerSeasonChart from "./playerSeasonChart";

type GameFilter = {
  gameType?: string;
  player?: string;
  date?: string;
}


export default function Index() {

  const [records, setRecords] = useState<GameRecord[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<{}>({});
  useEffect(() => {
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
  const gamesByDateAndType = league.gamesByDateAndType();

  return (
    <div className="font-sans antialiased bg-gray-100 h-screen flex flex-col w-dvw overflow-y-auto">
        <div className="bg-black text-white py-4 px-8 lg:text-center">
          <h1 className="text-2xl font-bold">The Daily Puzzler</h1>
        </div>

        {/* <!-- Main Content --> */}
        <main className="flex-grow text-black md:w-1/2 mx-auto lg:w-1/3 w-full">
            {/* <!-- Weekly Scoreboard --> */}
            <section className="p-4 text-gray-600 text-center w-full">
                <h2 className="text-xl font-semibold mb-2">
                  Weekly Standings
                  <span className="ml-1" onClick={() => setModalOpen(true)}><Info /></span>
                </h2>
                <h3 className="text-lg font-semibold mb-2 ml-4">{league.getSeasonDates()[0]} - {league.getSeasonDates()[1]}</h3>
                <div className="md:w-50">
                    {league.getSeasonScores().map((score) => {
                      return (
                          <Accordion key={score.player}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <div className="flex justify-between w-full">
                                <h1 className="font-semibold">{score.player}</h1>
                                <h1 className="font-semibold">{score.playerScore}</h1>
                              </div>
                            </AccordionSummary>
                            <AccordionDetails className="p-0 pl-4 pb-2">
                              <PlayerSeasonChart league={league} player={score.player} />
                            </AccordionDetails>
                          </Accordion>
                      );
                    })}
                </div>
            </section>
            {/* <!-- Game History --> */}
            <section className="p-4 text-gray-600 w-full">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-center">Game Records</h2>
                  {/* Add filters?? */}
                </div>

                {/* Games grouped by game_id */}
                <div>
                  {Object.keys(gamesByDateAndType).sort((a,b) => b < a ? -1 : 1).map(dateStr => {
                    return (
                      <div key={`game_day_${dateStr}`}>
                        <h3 className="text-xl font-semibold mb-2 text-gray-600">{DateTime.fromFormat(dateStr, "yyyy_MM_dd").toFormat("cccc, LLL d")}</h3>
                        {Object.keys(gamesByDateAndType[dateStr]).map(gameType => {
                          return <div key={`game_type_${gameType}`}>
                            <h4 className="text-lg font-semibold mb-2 text-gray-600">{gameType} #{gamesByDateAndType[dateStr][gameType][0].gameNumber}</h4>
                            <div className="flex flex-row gap-2 overflow-x-scroll w-full">
                            {gamesByDateAndType[dateStr][gameType].map(game => {
                              // make this div white rounded-lg shadow-md p-4 mb-4 min-width of 200px
                              return <GameCard key={game.game_id + game.player} game={game} />
                            })}
                            </div>
                          </div>
                        })}
                      </div>
                    )
                  })}
                </div>
                
                {/* <!-- Sample data: replace with dynamic data --> */}
                {/* {league.getActiveSeasonGames().map((game) => (
                  <div key={game.gameType + game.player + game.gameNumber} className="flex-shrink-0 bg-white rounded-lg shadow-md p-4 mb-4" >
                    <h4 className="text-lg font-semibold mb-2 text-gray-600">{game.gameType}: {game.gameNumber} - {game.dt.toFormat('ccc LLL d')}</h4>
                    <p className="font-semibold text-gray-600">{game.player}: {game.score}pts</p>
                    {game.text.split('\r\n').map((t, idx) => {
                      return <p key={`${t}_${idx}_${game.game_id}`}>{t}</p>
                    })}
                  </div>
                ))} */}
                {/* <!-- Add more date sections dynamically --> */}
            </section>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} className="bg-grey-200 p-4 mx-auto my-auto w-80/100 md:w-1/4">
              <div className="bg-white p-4 mx-auto my-auto w-3/4 md:w-1/4">
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold">League Info</h1>
                  <Close onClick={() => setModalOpen(false)} />
                </div>
                <section className="p-4">
                  <h2 className="text-xl">Join</h2>
                  <p className="text-sm text-grey-600">
                    To join the league, start emailing your NYT games scores to: 
                    <a href= "mailto: name@email.com" className="ml-1">arr213.nytg@valtown.email</a>
                  </p>
                </section>
                <section className="p-4 pt-0">
                  <h2 className="text-xl">Scoring</h2>
                  <p className="text-sm text-gray-600">We currently only accept Wordle, Connections, and Strands.</p>
                  <p className="text-sm text-gray-600">A loss on any game is worth 1 point, so be sure to submit even if you lose.</p>
                  <p className="text-sm text-gray-600">Scores reset weekly.</p>

                  <h3 className="text-xl mt-2">Wordle</h3>
                  <p className="text-sm text-gray-600">Wordle games receive 8 points minus the number of turns.</p>
                  
                  <h3 className="text-xl mt-2">Connections</h3>
                  <p className="text-sm text-gray-600">Connections games are 9 points minus the number of turns.</p>

                  <h3 className="text-xl mt-2">Strands</h3>
                  <p className="text-sm text-gray-600">Strands games are 5 points minus the number of hints. (4 or more hints receive a score of 2)</p>

                </section>
              </div>
            </Modal>
        </main>
    </div>
  );
}



function GameCard({game}: {game: ProcessedGameRecord}) {
  let gameText = game.text.split('\r\n');

  gameText = gameText.filter(line => !line.includes("Sent from"));

  switch (game.gameType) {
    case "Wordle":
      const topLine = gameText[0].split(" ");
      gameText[0] = topLine[topLine.length - 1];
      break;
    case "Connections":
      gameText = gameText.slice(2);
      break;
    case "Strands":
      gameText = gameText.slice(1);
      break;
  }

  return (
    <div key={game.game_id + game.player} className="bg-white rounded-lg shadow-md p-4 mb-4 min-w-60">
      <p className="font-semibold text-gray-600">{game.player}: {game.score}pts</p>
      {gameText.map((t, idx) => {
        return <p key={`${t}_${idx}_${game.game_id}`}>{t}</p>
      })}
    </div>
  )
}