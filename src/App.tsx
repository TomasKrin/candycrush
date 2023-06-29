import { Key, useEffect, useState } from "react";
import { candyColors, width } from "./consts/consts";

import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import blank from "./images/blank.jpg";
import styled from "styled-components";

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement]: any = useState([]);
  const [squareBeingDragged, setSquareBeingDragged]: any = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced]: any = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColumnsOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (
        columnOfFour.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 4);
        columnOfFour.forEach((square) => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForRowsOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64,
      ];
      const isBlank = currentColorArrangement[i] === blank;

      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 4);
        rowOfFour.forEach((square) => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColumnsOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (
        columnOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3);
        columnOfThree.forEach((square) => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForRowsOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
      const isBlank = currentColorArrangement[i] === blank;

      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 4);
        rowOfThree.forEach((square) => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 64 - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColorArrangement[i] === blank) {
        const randomNumber = Math.floor(Math.random() * candyColors.length);

        currentColorArrangement[i] = candyColors[randomNumber];
      }
      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  };

  const dragStart = (e: { target: any }) => {
    setSquareBeingDragged(e.target);
  };
  const dragDrop = (e: { target: any }) => {
    setSquareBeingReplaced(e.target);
  };
  const dragEnd = () => {
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute("data-id"));
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute("data-id"));

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute("src");
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute("src");

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
    ];
    const validMove = validMoves.includes(squareBeingReplacedId);
    const isAColumnOfFour = checkForColumnsOfFour();
    const isARowOfFour = checkForRowsOfFour();
    const isAColumnOfThree = checkForColumnsOfThree();
    const isARowOfThree = checkForRowsOfThree();

    if (
      squareBeingReplacedId &&
      validMove &&
      (isARowOfFour || isARowOfThree || isAColumnOfFour || isAColumnOfThree)
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute("src");
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute("src");
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  };

  const createBoard = () => {
    const randomColorArrangement: any = [];

    for (let i = 0; i < width * width; i++) {
      const randomNumber0to5 = Math.floor(Math.random() * candyColors.length);
      const randomColor = candyColors[randomNumber0to5];
      randomColorArrangement.push(randomColor);
    }

    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnsOfFour();
      checkForRowsOfFour();
      checkForColumnsOfThree();
      checkForRowsOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnsOfFour,
    checkForRowsOfFour,
    checkForColumnsOfThree,
    checkForRowsOfThree,
    currentColorArrangement,
    moveIntoSquareBelow,
  ]);

  return (
    <Container>
      <Game>
        {currentColorArrangement.map(
          (candyColor: string | undefined, index: Key | null | undefined) => (
            <img
              key={index}
              data-id={index}
              draggable={true}
              onDragStart={dragStart}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
              src={candyColor}
              alt={candyColor}
            />
          )
        )}
      </Game>
      <ScoreBoard score={scoreDisplay} />
    </Container>
  );
};

export default App;

const Container = styled.div`
  display: flex;
  padding: 30px;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

const Game = styled.div`
  width: 560px;
  height: 560px;
  display: flex;
  flex-wrap: wrap;
  img {
    width: 70px;
    height: 70px;
  }
`;
