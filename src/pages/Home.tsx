import { useMemo, useState } from 'react';

type Cell = 'X' | 'O' | null;

const WIN_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const result = useMemo(() => calculateWinner(board), [board]);
  const isDraw = !result && board.every((c) => c !== null);
  const finished = !!result || isDraw;

  const status = result
    ? `${result.winner} wins!`
    : isDraw
      ? "It's a draw"
      : `${xIsNext ? 'X' : 'O'}'s turn`;

  function handleClick(i: number) {
    if (board[i] || finished) return;
    const next = board.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);

    const w = calculateWinner(next);
    if (w) {
      setScores((s) => ({ ...s, [w.winner as 'X' | 'O']: s[w.winner as 'X' | 'O'] + 1 }));
    } else if (next.every((c) => c !== null)) {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
  }

  function newRound() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetAll() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0, draws: 0 });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-lg">
            Tic Tac Toe
          </h1>
          <p className="text-blue-200 mt-2 text-sm">Take turns. First to three in a row wins.</p>
        </header>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl bg-blue-900/60 border border-blue-400/30 backdrop-blur px-3 py-3 text-center">
            <div className="text-xs uppercase tracking-widest text-blue-200">Player X</div>
            <div className="text-2xl font-bold text-white mt-1">{scores.X}</div>
          </div>
          <div className="rounded-xl bg-blue-900/60 border border-blue-400/30 backdrop-blur px-3 py-3 text-center">
            <div className="text-xs uppercase tracking-widest text-blue-200">Draws</div>
            <div className="text-2xl font-bold text-white mt-1">{scores.draws}</div>
          </div>
          <div className="rounded-xl bg-blue-900/60 border border-blue-400/30 backdrop-blur px-3 py-3 text-center">
            <div className="text-xs uppercase tracking-widest text-blue-200">Player O</div>
            <div className="text-2xl font-bold text-white mt-1">{scores.O}</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-4">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              finished
                ? 'bg-cyan-300 text-blue-950'
                : 'bg-blue-950/60 border border-blue-400/40 text-blue-100'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Board */}
        <div className="rounded-2xl bg-blue-950/60 border border-blue-400/30 p-3 shadow-2xl shadow-blue-950/50 backdrop-blur">
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, i) => {
              const isWinning = result?.line.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  disabled={!!cell || finished}
                  aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ''}`}
                  className={`aspect-square rounded-xl text-4xl sm:text-5xl font-black flex items-center justify-center transition-all
                    ${
                      isWinning
                        ? 'bg-cyan-300 text-blue-950 scale-105 shadow-lg shadow-cyan-300/40'
                        : cell
                          ? 'bg-blue-700/70 text-white cursor-default'
                          : 'bg-blue-800/50 hover:bg-blue-700/70 active:scale-95 cursor-pointer'
                    }
                    border border-blue-400/20
                    ${finished && !isWinning ? 'opacity-80' : ''}
                  `}
                >
                  {cell && (
                    <span className={cell === 'X' ? 'text-cyan-200' : 'text-white'}>{cell}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={newRound}
            className="flex-1 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-blue-950 font-bold py-3 transition-colors shadow-lg shadow-cyan-500/30 active:scale-[0.98]"
          >
            New Round
          </button>
          <button
            onClick={resetAll}
            className="flex-1 rounded-xl bg-blue-900/70 hover:bg-blue-800 border border-blue-400/40 text-white font-semibold py-3 transition-colors active:scale-[0.98]"
          >
            Reset Scores
          </button>
        </div>

        <p className="text-center text-xs text-blue-300 mt-6">Made with a whole lot of blue.</p>
      </div>
    </div>
  );
}
