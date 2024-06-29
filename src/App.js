import './App.css';
import { GameView } from './GameView.tsx' 
import { GameContextProvider } from './GameContext.tsx';
import { Stack } from '@mui/material';

function App() {
  return (
    <div className="App">
      <GameContextProvider>
        <Stack maxWidth="600px" spacing={3} margin="20px auto" padding={1}>
          <h1>Bialect</h1>
          <p>Create two words by dragging letters out of your hand.<br />You don't need to use every letter, but more letters gives you more points!</p>
          <GameView />
        </Stack>
      </GameContextProvider>
    </div>
  );
}

export default App;
