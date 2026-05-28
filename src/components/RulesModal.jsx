import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function RulesModal({ onClose, variant = 'classic' }) {
    const [activeTab, setActiveTab] = useState(variant);

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.95)',
            zIndex: 200, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="glass-card animate-fade-in" style={{ maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2>Rules</h2>
                    <button className="btn btn-secondary btn-icon" onClick={onClose}><X size={20} /></button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    <button
                        className={`btn ${activeTab === 'classic' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('classic')}
                        style={{ flex: 1 }}
                    >
                        Classic
                    </button>
                    <button
                        className={`btn ${activeTab === 'vengeance' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('vengeance')}
                        style={{ flex: 1 }}
                    >
                        Vengeance
                    </button>
                </div>

                {activeTab === 'classic' ? (
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-dim)' }}>
                        <div>
                            <h3 style={{ color: 'var(--secondary)', marginBottom: '4px' }}>How to Score</h3>
                            <p>1. Sum up all your <b>Number Cards</b> (0–12).</p>
                            <p>2. If you have a <b>×2</b> card, double the sum of numbers.</p>
                            <p>3. Add any <b>Bonus Cards</b> (+2, +4, +6, +8, +10) to that total.</p>
                            <p>4. If you got a <b>Flip 7</b> (7 unique cards), add <b>+15</b> bonus.</p>
                        </div>

                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <h3 style={{ color: 'var(--accent-red)', marginBottom: '4px' }}>Busting</h3>
                            <p style={{ color: 'var(--text-main)' }}>If you draw a duplicate number card, you bust and score <b>0 points</b> for the round.</p>
                        </div>

                        <div>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '4px' }}>Winning</h3>
                            <p>The first player to reach <b>200 points</b> (or your set target) wins the game!</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-dim)' }}>
                        <div>
                            <h3 style={{ color: 'var(--secondary)', marginBottom: '4px' }}>How to Score</h3>
                            <p>1. Sum up all your <b>Number Cards</b> (0–13).</p>
                            <p>2. If you have a <b>÷2</b> card, halve the number sum (round down).</p>
                            <p>3. Subtract any <b>Penalty Cards</b> (−2, −4, −6, −8, −10).</p>
                            <p>4. If you got a <b>Flip 7</b> (7 unique cards), choose your bonus (see below).</p>
                            <p style={{ marginTop: '4px', fontSize: '0.85rem' }}>Scores <b>can go below zero</b>.</p>
                        </div>

                        <div style={{ background: 'rgba(255, 215, 0, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                            <h3 style={{ color: 'var(--secondary)', marginBottom: '4px' }}>Flip 7 — Choose Your Vengeance</h3>
                            <p style={{ color: 'var(--text-main)' }}>When you collect 7 unique number cards, pick one:</p>
                            <p style={{ color: 'var(--accent-green)', marginTop: '6px' }}><b>+15</b> added to your score</p>
                            <p style={{ color: 'var(--accent-red)' }}><b>−15</b> taken from any one opponent</p>
                        </div>

                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <h3 style={{ color: 'var(--accent-red)', marginBottom: '4px' }}>Busting</h3>
                            <p style={{ color: 'var(--text-main)' }}>Drawing a duplicate number card busts you (0 points), <b>except</b>: you may hold two 13s before the third causes a bust (<b>Lucky 13</b>).</p>
                        </div>

                        <div>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '4px' }}>Winning</h3>
                            <p>First player to reach <b>200 points</b> (or your set target) wins.</p>
                        </div>
                    </div>
                )}

                <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '24px' }}>Got it!</button>
            </div>
        </div>
    );
}
