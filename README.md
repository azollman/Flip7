# Flip7 Scoring App 🃏

A sleek, mobile-first scoring app for the **Flip7** card game family. Supports both **Classic** and **With a Vengeance** variants. Built with React and designed for quick, easy scorekeeping during family game nights.

## ✨ Features

- **Two Game Variants**: Choose Classic or With a Vengeance at the start of each game.
- **Local Storage Persistence**: Your game state is saved automatically. No logins required.
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

## 📏 Scoring Rules

### Classic
- **Numbers**: Sum of card values (0–12).
- **×2**: Doubles the sum of Number cards only.
- **Bonus Cards**: +2, +4, +6, +8, +10 added to the total.
- **Flip 7**: 7 unique numbers awards **+15 points** automatically.
- **Bust**: Duplicate number resets the round score to 0.

### With a Vengeance
- **Numbers**: Sum of card values (0–13).
- **÷2**: Halves the number sum (rounds down).
- **Penalty Cards**: −2, −4, −6, −8, −10 subtracted from the total.
- **Flip 7**: 7 unique numbers — choose **+15 to yourself** or **−15 to any opponent**.
- **Lucky 13**: You may hold two 13s; the third causes a bust.
- **Bust**: Duplicate number resets the round score to 0.
- Scores can go **below zero**.

Built with ❤️ for Flip7 fans.
