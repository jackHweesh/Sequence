# Sequence Game

A mobile-first web application that challenges users to put historical events in chronological order. Built with React, Tailwind CSS, and Framer Motion for smooth animations.

## Features

- 🎯 **Drag & Drop Interface**: Intuitive reordering of historical events
- 🎨 **Beautiful Animations**: Smooth transitions and visual feedback
- 📱 **Mobile-First Design**: Optimized for mobile devices
- 🎮 **Game Logic**: 3 attempts to get the correct chronological order
- 🟢 **Visual Feedback**: Green highlighting for correct positions
- 🔄 **Replayable**: Play again after completing the game

## Game Rules

1. **Objective**: Arrange 5 historical events in chronological order
2. **Attempts**: You have 3 tries to get it right
3. **Feedback**: After each guess, correct positions are highlighted in green
4. **Events**: 
   - Ice Age
   - Invention of the Wheel
   - Renaissance
   - Industrial Revolution
   - World War I

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SequenceGame
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Technologies Used

- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Beautiful DnD**: Drag and drop functionality

## Project Structure

```
src/
├── components/
│   ├── SequenceGame.js    # Main game component
│   └── DraggableItem.js   # Individual draggable item
├── utils/
│   └── gameData.js        # Game data and utilities
├── App.js                 # Root component
├── index.js              # Entry point
└── index.css             # Global styles
```

## Customization

The game is designed to be easily customizable:

- **Add New Events**: Modify the `EVENTS` array in `src/utils/gameData.js`
- **Change Correct Order**: Update the `CORRECT_ORDER` array
- **Modify Attempts**: Change the `triesLeft` initial value in `SequenceGame.js`
- **Styling**: Customize colors and animations in `tailwind.config.js`

## Future Enhancements

- [ ] Backend integration for score tracking
- [ ] Multiple difficulty levels
- [ ] Different categories of events
- [ ] Sound effects
- [ ] Progressive Web App features

## License

This project is open source and available under the [MIT License](LICENSE). 