"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";



export default function Index() {

  const [records, setRecords] = useState([]);
  useEffect(() => {
    // Your code here
    fetch("https://arr213-azureZebra.web.val.run/")
      .then((response) => response.json())
      .then((data) => {
        const recs = data.map((record: string[]) => {
          const recObj = {
            id: record[0],
            email: record[1],
            player: record[2],
            date: record[3],
            text: record[4],
            game: record[4].split('\w+')[0],
            dt: DateTime.fromObject({
              month: Number(record[3].split('-')[0]),
              day: Number(record[3].split('-')[1]),
              year: Number(record[3].split('-')[2])
            }),
          }
          return recObj;
        }).sort((a, b) => b.dt.toUnixInteger() - a.dt.toUnixInteger());
        setRecords(recs);
      });
  }, []);
  
  console.log("RECORDS", records);

  return (
    <div className="font-sans antialiased bg-gray-100 h-screen flex flex-col">
        {/* <!-- Header --> */}
        <div className="bg-blue-500 text-white py-4 px-8">
            <h1 className="text-2xl font-bold">The Daily Puzzler</h1>
        </div>

        {/* <!-- Main Content --> */}
        <main className="flex-grow overflow-y-auto text-black">
            {/* <!-- Monthly Scoreboard --> */}
            <section className="p-4 text-gray-600">
                <h2 className="text-xl font-semibold mb-4">May Standings</h2>
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
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-600">Monday, May 1st</h3>
                    <div className="flex space-x-4 overflow-x-auto">
                        {/* <!-- Game Cards --> */}
                        <div className="flex-shrink-0 bg-white rounded-lg shadow-md p-4" style={{minWidth: 300}}>
                            <h4 className="text-lg font-semibold mb-2 text-gray-600">Connections</h4>
                            <ul>
                                <li className="mb-2">
                                    <p className="font-semibold text-gray-600">Player 1: 100</p>
                                    {/* <!-- Add p for each line of text --> */}
                                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                    
                                </li>
                                {/* <!-- Add more games dynamically --> */}
                            </ul>
                        </div>
                        {/* <!-- Add more game cards dynamically --> */}
                    </div>
                </div>
                {/* <!-- Add more date sections dynamically --> */}
            </section>
        </main>
    </div>
  );
}

