import React, { createContext, useContext, useState } from "react"

export interface Letter {
  letter: string
  score: number
  id: string
}
export interface GameContextValue {
  wordA: Array<Letter>
  setWordA: (word: Array<Letter>) => void
  wordB: Array<Letter>
  setWordB: (word: Array<Letter>) => void
  handA: Array<Letter>
  setHandA: (word: Array<Letter>) => void
  handB: Array<Letter>
  setHandB: (word: Array<Letter>) => void
  errorA: boolean
  setErrorA: (error: boolean) => void
  errorB: boolean
  setErrorB: (error: boolean) => void
}

export const GameContext = createContext<GameContextValue | null>(null)

export function useGameContext() {
  const gameContext = useContext(GameContext)
  if (!gameContext) {
    throw new Error('useGameContext must be used within a GameContextProvider!')
  }
  return gameContext
}

export function GameContextProvider({ children }) {
  const [wordA, setWordA] = useState<Array<Letter>>([])
  const [wordB, setWordB] = useState<Array<Letter>>([])
  const [handA, setHandA] = useState<Array<Letter>>([])
  const [handB, setHandB] = useState<Array<Letter>>([])
  const [errorA, setErrorA] = useState(false)
  const [errorB, setErrorB] = useState(false)

  const value = {
    wordA,
    setWordA,
    wordB,
    setWordB,
    handA,
    setHandA,
    handB,
    setHandB,
    errorA,
    setErrorA,
    errorB,
    setErrorB,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}
