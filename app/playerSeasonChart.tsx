import {GameRecord, NYTGGameLeague} from "../utils/league";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@mui/material";
const dayLetters = ["S", "M", "T", "W", "R", "F", "S"];

export default function PlayerSeasonChart({league, player}: {
    league: NYTGGameLeague, 
    player: string
}) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-[auto,repeat(7,1fr)]">
                <div className="font-semibold">Game</div>
                {dayLetters.map((day) => (
                <div key={day} className="font-semibold">{day}</div>
                ))}
                {league.gameTypes.flatMap((gameType) => [
                <div key={gameType} className="font-semibold">{gameType}</div>,
                ...league.dayNumbers.map((day) => (
                    <div key={`${gameType}-${day}`}>
                    {league.getSeasonScoringChart()[player][gameType][day] || 0}
                    </div>
                )),
                ])}
            </div>
        </div>
    )
}