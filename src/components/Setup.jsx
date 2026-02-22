import React, { useState } from 'react';
import { Plus, Trash2, Play, Users, HelpCircle } from 'lucide-react';
import RulesModal from './RulesModal';

export default function Setup({ onStart }) {
    const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
    const [targetScore, setTargetScore] = useState(200);
    const [showRules, setShowRules] = useState(false);

    const addPlayer = () => {
        setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    };

    const removePlayer = (index) => {
        if (playerNames.length > 2) {
            const newNames = [...playerNames];
            newNames.splice(index, 1);
            setPlayerNames(newNames);
        }
    };

    const updateName = (index, name) => {
        const newNames = [...playerNames];
        newNames[index] = name;
        setPlayerNames(newNames);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onStart(playerNames.filter(n => n.trim() !== ''), targetScore);
    };

    return (
        <div className="animate-fade-in" style={{ padding: '20px' }}>
            {showRules && <RulesModal onClose={() => setShowRules(false)} />}

            <header style={{ marginBottom: '40px', textAlign: 'center', position: 'relative' }}>
                <button
                    onClick={() => setShowRules(true)}
                    style={{ position: 'absolute', right: 0, top: 0, background: 'none', border: 'none', color: 'var(--text-dim)' }}
                >
                    <HelpCircle size={24} />
                </button>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '0' }}>FLIP7</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Scoring App</p>
            </header>

            <div className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Users size={24} color="var(--primary)" />
                    <h2>Players</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {playerNames.map((name, index) => (
                        <div key={index} className="input-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => updateName(index, e.target.value)}
                                placeholder={`Player ${index + 1}`}
                            />
                            {playerNames.length > 2 && (
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-icon"
                                    onClick={() => removePlayer(index)}
                                    style={{ flexShrink: 0 }}
                                >
                                    <Trash2 size={20} color="var(--accent-red)" />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={addPlayer}
                        style={{ marginBottom: '32px', borderStyle: 'dashed' }}
                    >
                        <Plus size={20} /> Add Player
                    </button>

                    <div className="input-group">
                        <label className="input-label">Target Score</label>
                        <input
                            type="number"
                            value={targetScore}
                            onChange={(e) => setTargetScore(parseInt(e.target.value) || 0)}
                            step="50"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                        <Play size={20} fill="currentColor" /> Start Game
                    </button>
                </form>
            </div>
        </div>
    );
}
