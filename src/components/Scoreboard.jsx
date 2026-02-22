import React, { useState } from 'react';
import { Trophy, History, Plus, RotateCcw, Medal } from 'lucide-react';

export default function Scoreboard({ gameState, onAddRound, onUndo, onReset }) {
    const [view, setView] = useState('scores'); // 'scores' or 'history'

    const sortedPlayers = [...gameState.players].sort((a, b) => b.totalScore - a.totalScore);
    const leader = sortedPlayers[0];

    return (
        <div className="animate-fade-in" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ textAlign: 'left', fontSize: '2rem', marginBottom: '0' }}>FLIP7</h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Target: {gameState.targetScore}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className={`btn btn-secondary btn-icon ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
                        <History size={20} />
                    </button>
                    <button className="btn btn-secondary btn-icon" onClick={onReset} title="New Game">
                        <RotateCcw size={20} color="var(--accent-red)" />
                    </button>
                </div>
            </header>

            {view === 'scores' ? (
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {sortedPlayers.map((player, index) => (
                            <div
                                key={player.id}
                                className="glass-card"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    border: index === 0 ? '1px solid var(--secondary)' : '1px solid var(--glass-border)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {index === 0 && player.totalScore > 0 && (
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                                        <Trophy size={60} color="var(--secondary)" />
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%', background: index === 0 ? 'var(--secondary)' : 'var(--bg-dark)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: index === 0 ? 'black' : 'var(--text-dim)',
                                        fontSize: '0.9rem'
                                    }}>
                                        {index === 0 ? <Medal size={18} /> : index + 1}
                                    </div>
                                    <h2 style={{ fontSize: '1.25rem' }}>{player.name}</h2>
                                </div>

                                <div style={{ textAlignment: 'right' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: index === 0 ? 'var(--secondary)' : 'white' }}>
                                        {player.totalScore}
                                    </div>
                                    {player.history.length > 0 && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                                            +{player.history[player.history.length - 1]} last round
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1 }}>
                    <h2>History</h2>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {gameState.rounds.slice().reverse().map((round, rIndex) => (
                            <div key={rIndex} className="glass-card" style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Round {gameState.rounds.length - rIndex}</span>
                                    {rIndex === 0 && <button onClick={onUndo} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.8rem' }}>Undo</button>}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                    {gameState.players.map(p => (
                                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{p.name}:</span>
                                            <span style={{ fontWeight: '600' }}>{round[p.id]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {gameState.rounds.length === 0 && <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginTop: '40px' }}>No rounds played yet.</p>}
                    </div>
                    <button className="btn btn-secondary" onClick={() => setView('scores')} style={{ marginTop: '24px' }}>Back to Scores</button>
                </div>
            )}

            {view === 'scores' && !gameState.isGameOver && (
                <div style={{ position: 'fixed', bottom: '30px', left: '0', right: '0', padding: '0 20px', maxWidth: '500px', margin: '0 auto' }}>
                    <button className="btn btn-primary" onClick={onAddRound} style={{ height: '64px', borderRadius: '32px', fontSize: '1.2rem', boxShadow: '0 8px 24px rgba(255, 107, 0, 0.5)' }}>
                        <Plus size={24} strokeWidth={3} /> Add Scores
                    </button>
                </div>
            )}

            {gameState.isGameOver && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
                    <div className="glass-card animate-fade-in" style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                        <Trophy size={80} color="var(--secondary)" style={{ marginBottom: '20px' }} />
                        <h1 style={{ fontSize: '3rem' }}>WINNER!</h1>
                        <h2 style={{ fontSize: '2rem', marginBottom: '32px' }}>{gameState.winner.name}</h2>
                        <p style={{ marginBottom: '40px', color: 'var(--text-dim)' }}>Final Score: {gameState.winner.totalScore}</p>
                        <button className="btn btn-primary" onClick={onReset}>Start New Game</button>
                    </div>
                </div>
            )}
        </div>
    );
}
