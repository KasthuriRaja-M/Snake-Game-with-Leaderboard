# 🐍 Snake Game with Leaderboard

A modern, responsive Snake Game built with React featuring a persistent leaderboard system. Enjoy the classic snake game with beautiful graphics, smooth animations, and competitive scoring!

## ✨ Features

- **Classic Snake Gameplay**: Navigate the snake to eat food and grow longer
- **Power-up System**: Collect special items for temporary bonuses
  - ⚡ Speed Boost: Double movement speed for 5 seconds
  - 💎 Double Points: Earn 2x points for 8 seconds
  - 🛡️ Invincibility: Pass through walls and yourself for 6 seconds
  - 🔶 Snake Shrink: Reduce snake length for 4 seconds
- **Persistent Leaderboard**: Scores are saved locally in your browser
- **Modern UI/UX**: Beautiful glassmorphism design with smooth animations
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Game Controls**: 
  - Arrow keys for movement
  - Spacebar to pause/resume
  - Any key to start the game
- **Score Tracking**: Real-time score display and final score recording
- **Top Player Highlighting**: Special styling for top 3 players
- **Name Input System**: Save your score with your name or play anonymously
- **Active Effects Display**: Real-time status of active power-ups with countdown timers

## 🎮 How to Play

1. **Start the Game**: Press any key to begin
2. **Control the Snake**: Use arrow keys to move in different directions
3. **Eat Food**: Collect the orange food to grow and earn points (10 points each)
4. **Collect Power-ups**: Look for colored circles with symbols for special effects
   - ⚡ Green: Speed Boost (5 seconds)
   - 💎 Pink: Double Points (8 seconds)
   - 🛡️ Yellow: Invincibility (6 seconds)
   - 🔶 Orange: Snake Shrink (4 seconds)
5. **Avoid Collisions**: Don't hit the walls or your own tail (unless invincible!)
6. **Pause/Resume**: Press spacebar to pause or resume the game
7. **Save Your Score**: When the game ends, enter your name to save your score

## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Snake-Game-with-Leaderboard.git
   cd Snake-Game-with-Leaderboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   The application will automatically open in your default browser at `http://localhost:3000`

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🎯 Game Features

### Game Mechanics
- **Grid-based Movement**: 20x20 grid for precise control
- **Collision Detection**: Wall and self-collision detection (disabled during invincibility)
- **Food Generation**: Random food placement
- **Power-up System**: 20% chance to spawn special items after eating food
- **Score System**: 10 points per food item (doubled with power-up)
- **Dynamic Game Speed**: Adjustable speed with power-up effects
- **Visual Effects**: Rainbow colors during invincibility, glowing power-ups

### Leaderboard System
- **Local Storage**: Scores persist between browser sessions
- **Top 10 Display**: Shows only the highest scores
- **Date Tracking**: Records when each score was achieved
- **Anonymous Option**: Play without entering a name
- **Special Highlighting**: Gold, silver, and bronze styling for top 3

### Visual Design
- **Glassmorphism UI**: Modern translucent design elements
- **Gradient Backgrounds**: Beautiful color schemes
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Adapts to different screen sizes
- **Canvas Rendering**: Smooth game graphics

## 📱 Responsive Design

The game is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🎨 Customization

You can easily customize the game by modifying:
- `GRID_SIZE` in `SnakeGame.js` to change the game board size
- `GAME_SPEED` in `SnakeGame.js` to adjust game speed
- CSS variables in the component files for styling
- Color schemes and animations

## 🔧 Technical Details

### Built With
- **React 18**: Modern React with hooks
- **CSS3**: Custom styling with modern features
- **HTML5 Canvas**: For smooth game rendering
- **Local Storage**: For persistent data

### Project Structure
```
src/
├── components/
│   ├── SnakeGame.js          # Main game component
│   ├── SnakeGame.css         # Game styling
│   ├── Leaderboard.js        # Leaderboard component
│   └── Leaderboard.css       # Leaderboard styling
├── App.js                    # Main app component
├── App.css                   # App styling
├── index.js                  # Entry point
└── index.css                 # Global styles
```

## 🎯 Future Enhancements

Potential features for future versions:
- Multiple difficulty levels
- Sound effects and music
- Power-ups and special food
- Online multiplayer
- Global leaderboard
- Different snake skins
- Achievement system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Classic Snake game concept
- React community for excellent documentation
- Modern CSS techniques for beautiful UI

---

**Enjoy playing! 🐍🎮**
