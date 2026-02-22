import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import Setup from './components/Setup';
import Scoreboard from './components/Scoreboard';
import ScoreEntry from './components/ScoreEntry';

function App() {
  const { gameState, startNewGame, addRoundScores, undoLastRound, resetGame } = useGameState();
  const [screen, setScreen] = useState('main'); // 'main' or 'entry'

  const handleStart = (players, targetScore) => {
    startNewGame(players, targetScore);
  };

  const handleAddRound = () => {
    setScreen('entry');
    window.scrollTo(0, 0);
  };

  const handleSaveScores = (roundScores) => {
    addRoundScores(roundScores);
    setScreen('main');
    window.scrollTo(0, 0);
  };

  if (!gameState) {
    return <Setup onStart={handleStart} />;
  }

  if (screen === 'entry') {
    return (
      <ScoreEntry
        players={gameState.players}
        onSave={handleSaveScores}
        onCancel={() => setScreen('main')}
      />
    );
  }

  return (
    <Scoreboard
      gameState={gameState}
      onAddRound={handleAddRound}
      onUndo={undoLastRound}
      onReset={resetGame}
    />
  );
}

export default App;
