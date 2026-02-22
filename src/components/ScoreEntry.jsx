import React, { useState } from 'react';
import { X, Check, RotateCcw, Zap } from 'lucide-react';

export default function ScoreEntry({ players, onSave, onCancel }) {
    const [currentRound, setCurrentRound] = useState({});
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);

    const [numCards, setNumCards] = useState([]);
    const [modifiers, setModifiers] = useState([]);
    const [hasFlip7, setHasFlip7] = useState(false);
    const [isBusted, setIsBusted] = useState(false);

    const activePlayer = players[activePlayerIndex];

    const calculateScore = () => {
        if (isBusted) return 0;
        const sumNumbers = numCards.reduce((a, b) => a + b, 0);
        let total = sumNumbers;
        if (modifiers.includes('x2')) {
            total *= 2;
        }
        modifiers.forEach(mod => {
            if (mod.startsWith('+')) {
                total += parseInt(mod.substring(1));
            }
        });
        if (hasFlip7) {
            total += 15;
        }
        return total;
    };

    const currentScore = calculateScore();

    const handleToggleNumber = (n) => {
        if (isBusted) return;
        setNumCards([...numCards, n]);
    };

    const handleToggleModifier = (mod) => {
        if (isBusted) return;
        if (modifiers.includes(mod)) {
            setModifiers(modifiers.filter(m => m !== mod));
        } else {
            setModifiers([...modifiers, mod]);
        }
    };

    const resetCalculator = () => {
        setNumCards([]);
        setModifiers([]);
        setHasFlip7(false);
        setIsBusted(false);
    };

    const nextPlayer = () => {
        const updatedRound = { ...currentRound, [activePlayer.id]: currentScore };
        setCurrentRound(updatedRound);

        if (activePlayerIndex < players.length - 1) {
            setActivePlayerIndex(activePlayerIndex + 1);
            resetCalculator();
        } else {
            onSave(updatedRound);
        }
    };

    const handleBust = () => {
        setIsBusted(true);
        setNumCards([]);
        setModifiers([]);
        setHasFlip7(false);
    };

    return (
        <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>Player {activePlayerIndex + 1} of {players.length}</h2>
                <button className="btn btn-secondary btn-icon" onClick={onCancel}><X size={20} /></button>
            </div>

            <div className="glass-card" style={{
                textAlign: 'center',
                marginBottom: '24px',
                border: isBusted ? '2px solid var(--accent-red)' : '1px solid var(--glass-border)',
                padding: '32px 20px'
            }}>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '4px' }}>Scoring for</p>
                <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>{activePlayer.name}</h2>

                <div style={{
                    fontSize: '4.5rem',
                    fontWeight: '800',
                    color: isBusted ? 'var(--accent-red)' : 'var(--secondary)',
                    textShadow: isBusted ? '0 0 20px rgba(239, 68, 68, 0.3)' : '0 0 20px rgba(255, 215, 0, 0.3)',
                    lineHeight: 1
                }}>
                    {isBusted ? 'BUST' : currentScore}
                </div>
            </div>

            {!isBusted && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0].map(n => (
                        <button
                            key={n}
                            className="btn btn-secondary"
                            style={{ height: '54px', fontSize: '1.2rem', borderRadius: '12px' }}
                            onClick={() => handleToggleNumber(n)}
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        className={`btn ${hasFlip7 ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                            gridColumn: 'span 3',
                            background: hasFlip7 ? 'var(--accent-green)' : '',
                            borderRadius: '12px'
                        }}
                        onClick={() => setHasFlip7(!hasFlip7)}
                    >
                        <Zap size={18} fill={hasFlip7 ? 'currentColor' : 'none'} /> Flip 7 (+15)
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
                {['+2', '+4', '+6', '+8', '+10', 'x2'].map(mod => (
                    <button
                        key={mod}
                        className={`btn ${modifiers.includes(mod) ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ borderRadius: '12px' }}
                        onClick={() => handleToggleModifier(mod)}
                        disabled={isBusted}
                    >
                        {mod}
                    </button>
                ))}
            </div>

            <div style={{
                minHeight: '40px',
                marginBottom: '24px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.2)',
                padding: '10px',
                borderRadius: '12px'
            }}>
                {numCards.length === 0 && !isBusted && <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Tap numbers to add cards</span>}
                {numCards.map((n, i) => (
                    <div key={i} style={{
                        background: 'var(--primary)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        animation: 'slideUp 0.2s ease-out'
                    }}>{n}</div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={isBusted ? resetCalculator : handleBust} style={{ flex: 1 }}>
                    <RotateCcw size={20} /> {isBusted ? 'Reset' : 'Bust'}
                </button>
                <button className="btn btn-primary" onClick={nextPlayer} style={{ flex: 2 }}>
                    {activePlayerIndex === players.length - 1 ? 'Finish Round' : 'Next Player'} <Check size={20} />
                </button>
            </div>
        </div>
    );
}
