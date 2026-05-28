import React, { useState } from 'react';
import { X, Check, RotateCcw, Zap, Bomb } from 'lucide-react';

export default function ScoreEntry({ players, variant = 'classic', onSave, onCancel }) {
    const [currentRound, setCurrentRound] = useState({});
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [numCards, setNumCards] = useState([]);
    const [modifiers, setModifiers] = useState([]);
    const [hasFlip7, setHasFlip7] = useState(false);
    const [isBusted, setIsBusted] = useState(false);
    const [flip7Choice, setFlip7Choice] = useState(null); // null | 'self' | 'opponent'
    const [flip7Target, setFlip7Target] = useState(null); // player id when 'opponent'
    const [vengeanceHits, setVengeanceHits] = useState({}); // { [playerId]: delta } — accumulates across players

    const isVengeance = variant === 'vengeance';
    const activePlayer = players[activePlayerIndex];
    const otherPlayers = players.filter(p => p.id !== activePlayer.id);

    const NUMBERS = isVengeance
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0]
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0];
    const MODIFIERS = isVengeance
        ? ['-2', '-4', '-6', '-8', '-10', '÷2']
        : ['+2', '+4', '+6', '+8', '+10', 'x2'];

    // Classic: 13 numbers → 0 at col1 of row4, Flip7 spans cols 2-4
    // Vengeance: 14 numbers → 13 at col1, 0 at col2 of row4, Flip7 spans cols 3-4
    const flip7ColSpan = isVengeance ? 'span 2' : 'span 3';

    const calculateScore = () => {
        if (isBusted) return 0;
        const sumNumbers = numCards.reduce((a, b) => a + b, 0);
        let total = sumNumbers;

        if (isVengeance) {
            if (modifiers.includes('÷2')) {
                total = Math.floor(total / 2);
            }
            modifiers.forEach(mod => {
                if (mod.startsWith('-')) {
                    total += parseInt(mod);
                }
            });
            if (hasFlip7 && flip7Choice === 'self') {
                total += 15;
            }
        } else {
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
        }
        return total;
    };

    const currentScore = calculateScore();

    const handleToggleNumber = (n) => {
        if (isBusted || hasFlip7) return;

        const count = numCards.filter(x => x === n).length;
        // Lucky 13 in Vengeance: allow one duplicate 13, third tap busts
        const busts = isVengeance
            ? (count > 0 && !(n === 13 && count === 1))
            : count > 0;

        if (busts) {
            handleBust();
            return;
        }

        const newNumCards = [...numCards, n];
        setNumCards(newNumCards);

        if (new Set(newNumCards).size === 7) {
            setHasFlip7(true);
        }
    };

    const handleToggleModifier = (mod) => {
        if (isBusted) return;
        setModifiers(prev =>
            prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
        );
    };

    const resetCalculator = () => {
        setNumCards([]);
        setModifiers([]);
        setHasFlip7(false);
        setIsBusted(false);
        setFlip7Choice(null);
        setFlip7Target(null);
        // vengeanceHits intentionally preserved — accumulates for the full round
    };

    const handleBust = () => {
        setIsBusted(true);
        setNumCards([]);
        setModifiers([]);
        setHasFlip7(false);
        setFlip7Choice(null);
        setFlip7Target(null);
    };

    const handleVengeanceChoice = (targetId) => {
        setFlip7Choice('opponent');
        setFlip7Target(targetId);
        setVengeanceHits(prev => ({ ...prev, [targetId]: (prev[targetId] || 0) - 15 }));
    };

    const canProceed = !(isVengeance && hasFlip7 && flip7Choice === null);

    const nextPlayer = () => {
        if (!canProceed) return;

        const score = calculateScore();
        const updatedRound = { ...currentRound, [activePlayer.id]: score };

        if (activePlayerIndex < players.length - 1) {
            setCurrentRound(updatedRound);
            setActivePlayerIndex(activePlayerIndex + 1);
            resetCalculator();
        } else {
            // Apply accumulated vengeance hits to final round scores
            const finalRound = { ...updatedRound };
            Object.entries(vengeanceHits).forEach(([pid, delta]) => {
                finalRound[pid] = (finalRound[pid] ?? 0) + delta;
            });
            onSave(finalRound);
        }
    };

    const scoreColor = isBusted
        ? 'var(--accent-red)'
        : currentScore < 0
            ? 'var(--accent-red)'
            : 'var(--secondary)';
    const scoreShadow = (isBusted || currentScore < 0)
        ? '0 0 20px rgba(239, 68, 68, 0.3)'
        : '0 0 20px rgba(255, 215, 0, 0.3)';

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '20px', minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>Player {activePlayerIndex + 1} of {players.length}</h2>
                    <button className="btn btn-secondary btn-icon" onClick={onCancel}><X size={20} /></button>
                </div>

                <div className="glass-card" style={{
                    textAlign: 'center',
                    marginBottom: '16px',
                    border: isBusted ? '2px solid var(--accent-red)' : '1px solid var(--glass-border)',
                    padding: '16px 20px'
                }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '4px' }}>Scoring for</p>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{activePlayer.name}</h2>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: scoreColor, textShadow: scoreShadow, lineHeight: 1 }}>
                        {isBusted ? 'BUST' : currentScore}
                    </div>
                </div>

                {!isBusted && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                        {NUMBERS.map(n => {
                            const count = numCards.filter(x => x === n).length;
                            const isSelected = count > 0;
                            const isDouble13 = isVengeance && n === 13 && count === 2;
                            return (
                                <button
                                    key={n}
                                    className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{
                                        height: '54px',
                                        fontSize: '1.2rem',
                                        borderRadius: '12px',
                                        ...(isDouble13 ? { background: 'var(--accent-red)', borderColor: 'var(--accent-red)' } : {})
                                    }}
                                    onClick={() => handleToggleNumber(n)}
                                >
                                    {n}
                                </button>
                            );
                        })}
                        <div
                            className={`btn ${hasFlip7 ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                                gridColumn: flip7ColSpan,
                                background: hasFlip7 ? 'var(--accent-green)' : '',
                                borderRadius: '12px',
                                cursor: 'default',
                                opacity: hasFlip7 ? 1 : 0.5
                            }}
                        >
                            <Zap size={18} fill={hasFlip7 ? 'currentColor' : 'none'} />
                            {hasFlip7
                                ? (isVengeance ? 'Flip 7!' : 'Flip 7 Bonus Active!')
                                : 'Flip 7 (Automatic)'}
                        </div>
                    </div>
                )}

                {/* Vengeance Flip 7 choice panel */}
                {isVengeance && hasFlip7 && (
                    <div className="glass-card" style={{
                        marginBottom: '16px',
                        padding: '16px',
                        border: flip7Choice === null
                            ? '1px solid var(--secondary)'
                            : '1px solid var(--glass-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <Zap size={16} color="var(--secondary)" fill="currentColor" />
                            <span style={{ fontWeight: '700', color: 'var(--secondary)', fontSize: '0.95rem' }}>FLIP 7 BONUS</span>
                        </div>
                        {flip7Choice === null ? (
                            <>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '10px' }}>Choose your reward:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setFlip7Choice('self')}
                                        style={{ background: 'var(--accent-green)', borderColor: 'var(--accent-green)', flex: '1 1 auto' }}
                                    >
                                        +15 (me)
                                    </button>
                                    {otherPlayers.map(p => (
                                        <button
                                            key={p.id}
                                            className="btn btn-secondary"
                                            onClick={() => handleVengeanceChoice(p.id)}
                                            style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)', flex: '1 1 auto' }}
                                        >
                                            −15 → {p.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p style={{ fontWeight: '600', color: flip7Choice === 'self' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                {flip7Choice === 'self'
                                    ? '+15 to you!'
                                    : `−15 → ${players.find(p => p.id === flip7Target)?.name}`}
                            </p>
                        )}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    {MODIFIERS.map(mod => (
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
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '10px',
                    borderRadius: '12px'
                }}>
                    {numCards.length === 0 && !isBusted && (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Tap numbers to add cards</span>
                    )}
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
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', flexShrink: 0 }}>
                <button className="btn btn-secondary" onClick={isBusted ? resetCalculator : handleBust} style={{ flex: 1 }}>
                    {isBusted ? <RotateCcw size={20} /> : <Bomb size={20} />} {isBusted ? 'Reset' : 'Bust'}
                </button>
                <button
                    className="btn btn-primary"
                    onClick={nextPlayer}
                    disabled={!canProceed}
                    style={{ flex: 2, opacity: canProceed ? 1 : 0.5 }}
                >
                    {activePlayerIndex === players.length - 1 ? 'Finish Round' : 'Next Player'} <Check size={20} />
                </button>
            </div>
        </div>
    );
}
