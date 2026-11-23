import { useCallback, useEffect, useState } from "react";
import "./App.css";
import words from "./wordList.json";
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([""]);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter),
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (key: string) => {
      if (isWinner || isLoser) return;
      setGuessedLetters((prevKeys) => {
        if (prevKeys.includes(key)) return prevKeys;
        return [...prevKeys, key];
      });
    },
    [isWinner, isLoser],
  );
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [addGuessedLetter]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setGuessedLetters([]);
        setWordToGuess(words[Math.floor(Math.random() * words.length)]);
      }
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 auto",
        maxWidth: "800px",
        fontFamily: "Arial, sans-serif",
        padding: "1rem",
        boxSizing: "border-box",
        width: "100%",
        gap: "clamp(1rem, 3vw, 2rem)",
      }}
    >
      <div
        className="result_text"
        style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", textAlign: "center" }}
      >
        {isLoser && "You have lost - Press Enter or Refresh to try again"}
        {isWinner && "Winner! - Press Enter or Refresh to try again"}
      </div>
      <div className="hangman-drawing">
        <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      </div>
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter),
          )}
          inactiveLetters={guessedLetters.filter(
            (letter) => !wordToGuess.includes(letter),
          )}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
