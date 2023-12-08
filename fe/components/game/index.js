import React, { useState, useEffect } from "react";
import Image from "next/image";

function GameImage() {
  const board = ["🍇", "🍈", "🍊", "🍌", "🍍", "🥦", "🍏", "🥭"];
  const [boardData, setBoardData] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showImages, setShowImages] = useState(Array(board.length * 2).fill(false));
  const [countdown, setCountdown] = useState(60);
  const [countdownStarted, setCountdownStarted] = useState(false);

  const initialize = () => {
    shuffle();
    setGameOver(false);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setShowImages(Array(board.length * 2).fill(false));
    setCountdownStarted(false);
    setCountdown(60);
  };

  const start = () => {
    shuffle();
    setGameOver(false);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setShowImages(Array(board.length * 2).fill(false));
    setCountdownStarted(true);
  };

  const shuffle = () => {
    const shuffledCards = [...board, ...board]
      .sort(() => Math.random() - 0.5)
      .map((v) => v);

    setBoardData(shuffledCards);
  };

  const updateActiveCards = (i) => {
    if (!flippedCards.includes(i) && !matchedCards.includes(i)) {
      if (flippedCards.length === 1) {
        const firstIdx = flippedCards[0];
        const secondIdx = i;
        if (boardData[firstIdx] === boardData[secondIdx]) {
          setMatchedCards((prev) => [...prev, firstIdx, secondIdx]);
        }
        setFlippedCards([...flippedCards, i]);
      } else if (flippedCards.length === 2) {
        setFlippedCards([i]);
      } else {
        setFlippedCards([...flippedCards, i]);
      }

      setMoves((v) => v + 1);
      toggleShowImage(i);
    }
  };

  const toggleShowImage = (i) => {
    const newShowImages = [...showImages];
    newShowImages[i] = !newShowImages[i];
    setShowImages(newShowImages);
  };

  useEffect(() => {
    if (matchedCards.length === board.length * 2) {
      setGameOver(true);
    }
  }, [moves]);

  useEffect(() => {
    if (countdownStarted) {
      const timer = setInterval(() => {
        if (countdown > 0 && !gameOver) {
          setCountdown((prev) => prev - 1);
        } else {
          clearInterval(timer);
          // Xử lý khi đếm ngược kết thúc
        }
      }, 1000);

      return () => clearInterval(timer); // Dọn dẹp timer khi component unmount
    }
  }, [countdown, countdownStarted, gameOver]);

  return (
    <div className="shadow dark:bg-[#0D0D0D] bg-white p-8 rounded-[10px] flex flex-col gap-3 overflow-hidden">
      <div className="flex flex-col items-center pb-10">
        <Image className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/21846840_6543588.svg" width={50} height={50} />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{`Number Moves`}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{`Number move: ${moves}`}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{`Time countdown: ${countdown}`}</span>
        <div className="flex mt-4 md:mt-6 mb-10">
          <button
            type="button"
            onClick={() => start()}
            className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
            disabled={gameOver || countdownStarted}
          >
            <svg
              className="w-4 h-4 me-2 -ms-1"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="bitcoin"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M504 256c0 136.1-111 248-248 248S8 392.1 8 256 119 8 256 8s248 111 248 248zm-141.7-35.33c4.937-32.1-20.19-50.74-54.55-62.57l11.15-44.7-27.21-6.781-10.85 43.52c-7.154-1.783-14.5-3.464-21.8-5.13l10.93-43.81-27.2-6.781-11.15 44.69c-5.922-1.349-11.73-2.682-17.38-4.084l.031-.14-37.53-9.37-7.239 29.06s20.19 4.627 19.76 4.913c11.02 2.751 13.01 10.04 12.68 15.82l-12.7 50.92c.76.194 1.744.473 2.829.907-.907-.225-1.876-.473-2.876-.713l-17.8 71.34c-1.349 3.348-4.767 8.37-12.47 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.15 35.41 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.26 45.21 27.18 6.781 11.15-44.73a1038 1038 0 0 0 21.69 5.627l-11.11 44.52 27.21 6.781 11.26-45.13c46.4 8.781 81.3 5.239 95.99-36.73 11.84-33.79-.589-53.28-25-65.99 17.78-4.098 31.17-15.79 34.75-39.95zm-62.18 87.18c-8.41 33.79-65.31 15.52-83.75 10.94l14.94-59.9c18.45 4.603 77.6 13.72 68.81 48.96zm8.417-87.67c-7.673 30.74-55.03 15.12-70.39 11.29l13.55-54.33c15.36 3.828 64.84 10.97 56.85 43.03z"
              ></path>
            </svg>
            Start Game
          </button>
          <div className="w-4" />
          <button
            type="button"
            onClick={() => initialize()}
            className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
          >
            <svg
              className="w-4 h-4 me-2 -ms-1"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="bitcoin"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M504 256c0 136.1-111 248-248 248S8 392.1 8 256 119 8 256 8s248 111 248 248zm-141.7-35.33c4.937-32.1-20.19-50.74-54.55-62.57l11.15-44.7-27.21-6.781-10.85 43.52c-7.154-1.783-14.5-3.464-21.8-5.13l10.93-43.81-27.2-6.781-11.15 44.69c-5.922-1.349-11.73-2.682-17.38-4.084l.031-.14-37.53-9.37-7.239 29.06s20.19 4.627 19.76 4.913c11.02 2.751 13.01 10.04 12.68 15.82l-12.7 50.92c.76.194 1.744.473 2.829.907-.907-.225-1.876-.473-2.876-.713l-17.8 71.34c-1.349 3.348-4.767 8.37-12.47 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.15 35.41 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.26 45.21 27.18 6.781 11.15-44.73a1038 1038 0 0 0 21.69 5.627l-11.11 44.52 27.21 6.781 11.26-45.13c46.4 8.781 81.3 5.239 95.99-36.73 11.84-33.79-.589-53.28-25-65.99 17.78-4.098 31.17-15.79 34.75-39.95zm-62.18 87.18c-8.41 33.79-65.31 15.52-83.75 10.94l14.94-59.9c18.45 4.603 77.6 13.72 68.81 48.96zm8.417-87.67c-7.673 30.74-55.03 15.12-70.39 11.29l13.55-54.33c15.36 3.828 64.84 10.97 56.85 43.03z"
              ></path>
            </svg>
            Reset Game
          </button>
        </div>
        <div className="text-center font-bold px-6 dark:text-[#B3B3B3]">
          <div className="grid grid-cols-4 gap-4">
            {boardData.map((data, i) => {
              const flipped = flippedCards.includes(i);
              const matched = matchedCards.includes(i);
              const isVisible = flipped || matched;
              return (
                <div
                  key={i}
                  onClick={() => {
                    updateActiveCards(i);
                  }}
                  className={`w-24 h-24 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 ${isVisible ? "active" : ""} ${matched ? "matched" : ""} ${gameOver ? "gameover" : ""}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.0rem" }}
                >
                  <div className={`card-front ${isVisible ? "visible" : ""}`}>{isVisible ? data : ""}</div>
                  <div className="card-back"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameImage;
