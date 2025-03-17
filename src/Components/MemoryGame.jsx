import React, { useEffect, useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const handleGridSizeChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setGridSize("");
      return;
    }

    const size = parseInt(value, 10);

    if (!isNaN(size) && size >= 2 && size <= 10) {
      setGridSize(size);
    }
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffleCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((num, index) => ({ id: index, number: num }));

    setCards(shuffleCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;

    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    if (disabled || won) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);

      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
        setMoves(moves + 1);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 p-6 text-white">
      <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">Memory Game</h1>

    
      <div className="mb-6">
        <label htmlFor="gridSize" className="text-lg font-semibold">
          Grid Size: (2-10)
        </label>
        <input
          type="text"
          id="gridSize"
          value={gridSize}
          onChange={handleGridSizeChange}
          className="border-2 border-white bg-transparent rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white ml-3 text-lg w-16 text-center"
        />
      </div>

      
      <div className="mb-4 text-xl font-semibold bg-white text-indigo-600 px-4 py-2 rounded shadow-md">
        Moves: {moves}
      </div>

    
      <div
        className="grid gap-3 p-3 bg-white/20 backdrop-blur-md rounded-lg shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%,${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer transition-all duration-300 shadow-md transform ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white scale-105"
                    : "bg-blue-500 text-white scale-105"
                  : "bg-gray-300 text-gray-400 hover:scale-105"
              }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

  
      {won && (
        <div className="mt-6 text-4xl font-bold text-green-400 animate-bounce">
          You Won in {moves} moves! 🎉
        </div>
      )}

  
      <button
        onClick={initializeGame}
        className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 shadow-lg text-lg font-semibold"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
