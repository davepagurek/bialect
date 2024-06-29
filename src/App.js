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
          <GameView />
        </Stack>
      </GameContextProvider>
    </div>
  );
}

export default App;
