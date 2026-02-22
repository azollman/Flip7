# Flip7 Scoring App 🃏

A sleek, mobile-first scoring app for the **Flip7** card game. Built with React and designed for quick, easy scorekeeping during family game nights.

## ✨ Features

- **Local Storage Persistence**: Your game state is saved automatically on your phone. No logins required.
- **Smart Calculator**: Visual card-based input for scoring rounds exactly as the rules specify.
- **Winner Detection**: Automatically highlights the leader and detects when someone hits the target score (default 200).
- **History & Undo**: View previous rounds and undo mistakes with a single tap.
- **Fun Aesthetics**: Glassmorphic UI with vibrant colors and smooth animations.

## 🚀 Getting Started

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment to Cloudflare
This app is perfect for **Cloudflare Pages**. It's entirely client-side, making deployment free and extremely fast.

1. Create a new GitHub repository and push this code.
2. In your Cloudflare Dashboard, go to **Pages** > **Create a project** > **Connect to Git**.
3. Select your repository.
4. Set the **Build settings**:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click **Save and Deploy**.

## 📏 Scoring Rules Implementation
The app follows the official Flip7 rules:
- **Numbers**: Sum of card values (0-12).
- **Multipliers**: The `x2` card doubles the sum of Number cards **only**.
- **Modifiers**: Bonus cards (+2, +4, etc.) are added to the total.
- **Flip 7**: Successfully collecting 7 unique numbers awards a **+15 point** bonus.
- **Busting**: Duplicate numbers reset the round score to 0.

Built with ❤️ for Flip7 fans.
