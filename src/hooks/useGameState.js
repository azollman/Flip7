import { useState, useEffect } from 'react';

const STORAGE_KEY = 'flip7_game_state_v1';

export function useGameState() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (gameState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [gameState]);

  const startNewGame = (players, targetScore = 200) => {
    const newGame = {
      players: players.map(name => ({
        id: crypto.randomUUID(),
        name,
        totalScore: 0,
        history: []
      })),
      targetScore,
      rounds: [],
      isGameOver: false,
      winner: null,
      createdAt: new Date().toISOString()
    };
    setGameState(newGame);
  };

  const addRoundScores = (roundScores) => {
    // roundScores: { [playerId]: score }
    setGameState(prev => {
      if (!prev) return null;

      const updatedPlayers = prev.players.map(player => {
        const roundScore = roundScores[player.id] || 0;
        const newTotal = player.totalScore + roundScore;
        return {
          ...player,
          totalScore: newTotal,
          history: [...player.history, roundScore]
        };
      });

      // Check for winner
      let winner = prev.winner;
      let isGameOver = prev.isGameOver;
      
      const potentialWinners = updatedPlayers.filter(p => p.totalScore >= prev.targetScore);
      if (potentialWinners.length > 0) {
        winner = potentialWinners.reduce((prev, current) => 
          (prev.totalScore > current.totalScore) ? prev : current
        );
        isGameOver = true;
      }

      return {
        ...prev,
        players: updatedPlayers,
        rounds: [...prev.rounds, roundScores],
        isGameOver,
        winner
      };
    });
  };

  const undoLastRound = () => {
    setGameState(prev => {
      if (!prev || prev.rounds.length === 0) return prev;

      const updatedPlayers = prev.players.map(player => {
        const newHistory = [...player.history];
        const lastScore = newHistory.pop() || 0;
        return {
          ...player,
          totalScore: player.totalScore - lastScore,
          history: newHistory
        };
      });

      const newRounds = [...prev.rounds];
      newRounds.pop();

      return {
        ...prev,
        players: updatedPlayers,
        rounds: newRounds,
        isGameOver: false,
        winner: null
      };
    });
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to start a completely new game? Current progress will be lost.')) {
      setGameState(null);
    }
  };

  return {
    gameState,
    startNewGame,
    addRoundScores,
    undoLastRound,
    resetGame
  };
}
