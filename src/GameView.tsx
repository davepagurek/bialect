import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGameContext, Letter } from './GameContext.tsx'
import { useDictionary } from './useDictionary.js'
import { makeLetters, scoreWord, validPairs, validPairsGenerator } from './game'
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd'
import { Box, Button, CircularProgress, Stack } from '@mui/material'
import { WordView } from './WordView.tsx'
import { Task } from './Task.ts'
import { HistogramChart } from '@carbon/charts-react'
import '@carbon/charts/styles.css'

export function GameView() {
  const {
    handA,
    setHandA,
    handB,
    setHandB,
    wordA,
    setWordA,
    wordB,
    setWordB,
    errorA,
    setErrorA,
    errorB,
    setErrorB,
  } = useGameContext()

  useEffect(() => {
    const oldSetTimeout = window.setTimeout
    window.setTimeout = function(cb) {
      return oldSetTimeout(cb, 0)
    }

    return () => {
      window.setTimeout = oldSetTimeout
    }
  }, [])

  const [initialLetters, setInitialLetters] = useState<Letter[]>([])
  const { ready, words } = useDictionary()
  const [allScores, setAllScores] = useState<Array<any> | undefined>(undefined)
  const [done, setDone] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState<number | undefined>(undefined)
  const [totalScore, setTotalScore] = useState(0)

  useLayoutEffect(() => {
    const updateSize = () => {
      setWidth(containerRef.current!.getBoundingClientRect().width)
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  // Initialize game
  useEffect(() => {
    if (!ready) return
    const hand = makeLetters()
    setInitialLetters(hand)
    setHandA(hand.slice(0, 6))
    setHandB(hand.slice(6, 12))

    const task = new Task(validPairsGenerator(hand, words), 1 / 60)
    task.then((pairs) => {
      setAllScores(
        pairs.map((words) => {
          const [scoreA, scoreB] = words.map((w) =>
            scoreWord(
              w.split('').map((char) => hand.find((l) => l.letter === char))
            )
          )
          return {
            words,
            score: scoreA + scoreB,
          }
        })
        .sort((a, b) => b.score - a.score)
      )
    })
  }, [ready])

  useEffect(() => {
    const wordAStr = wordA.map((w) => w.letter).join('')
    const wordBStr = wordB.map((w) => w.letter).join('')
    setErrorA(!!wordAStr && !words.has(wordAStr))
    setErrorB(!!wordBStr && !words.has(wordBStr))
    setTotalScore(scoreWord(wordA) + scoreWord(wordB))
  }, [wordA, wordB])

  const onDragEnd = useCallback<OnDragEndResponder>((result, _provided) => {
    if (result.reason === 'CANCEL') return
    if (!result.destination) return

    const newState = {
      wordA: [...wordA],
      wordB: [...wordB],
      handA: [...handA],
      handB: [...handB],
    }
    const [letter] = newState[result.source.droppableId].splice(result.source.index, 1)
    newState[result.destination.droppableId].splice(result.destination.index, 0, letter)

    setWordA(newState.wordA)
    setWordB(newState.wordB)
    setHandA(newState.handA)
    setHandB(newState.handB)
  }, [wordA, wordB, handA, handB])

  const showScores = useCallback(() => {
    setDone(true)
  }, [])

  let content
  if (done && !allScores) {
    content = (
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <span>Submitting...</span>
        <CircularProgress variant="indeterminate" />
      </Stack>
    )
  } else if (done && allScores) {
    console.log([
              ...allScores.map((s) => ({ value: s.score, group: 'Everyone' })),
            ])
    content = (
      <>
        <h2>
          {wordA.map((l) => l.letter).join('')},&nbsp;
          {wordB.map((l) => l.letter).join('')}&nbsp;
          <span style={{ color: 'green' }}>({totalScore})</span>
        </h2>
        <h3>
          Your rank is {Math.floor(100 - (allScores.map((v) => v.score).indexOf(totalScore) / allScores.length) * 100)}%
        </h3>
        <Box>
          <HistogramChart
            data={[
              ...allScores.map((s) => ({ value: s.score, group: 'Everyone' })),
            ]}
            options={{
              title: 'All Submissions',
              axes: {
                left: {
                  title: 'Submissions',
                  binned: true,
                },
                bottom: {
                  title: 'Score',
                  bins: 10,
                  mapsTo: 'value',
                  limitDomainToBins: true,
                },
              },
              legend: {
                enabled: false,
              },
              toolbar: {
                enabled: false,
              },
              height: `${width}px`,
              getFillColor: (_group, _label, { data }) => {
                if (!data) return '#58F'
                const { x0: from, x1: to } = data
                if (totalScore >= parseInt(from, 10) && totalScore < parseInt(to, 10)) {
                  return '#FB2'
                } else {
                  return '#58F'
                }
              }
            }}
          />
        </Box>
        <h3>Top Submissions</h3>
        <Stack spacing={1}>
          {allScores.slice(0, 10).map(({ words: [a, b], score }, i) => (
            <p key={i}>{a}, {b} ({score})</p>
          ))}
        </Stack>
        <h3>Play again tomorrow!</h3>
      </>
    )
  } else {
    content = (
      <>
        <Stack spacing={2}>
          <WordView id="wordA" letters={wordA} error={errorA} width={width} />
          <span style={{ marginTop: -2, marginBottom: 5 }}>{errorA ? 'Not a word' : scoreWord(wordA)}</span>
        </Stack>
        <Stack spacing={2}>
          <WordView id="wordB" letters={wordB} error={errorB} width={width} />
          <span style={{ marginTop: -2, marginBottom: 5 }}>{errorB ? 'Not a word' : scoreWord(wordB)}</span>
        </Stack>
        <Box height={24} />
        <Box borderRadius={3} border="1px solid gray" paddingTop={1} paddingBottom={1}>
          <WordView id="handA" letters={handA} width={width} hideOutline />
          <WordView id="handB" letters={handB} width={width} hideOutline />
        </Box>
        <Box height={24} />
        <Button
          variant="contained"
          onClick={showScores}
          disabled={errorA || errorB || wordA.length === 0 || wordB.length === 0}
        >
          Submit
          {wordA.length > 0 && wordB.length > 0 && !errorA && !errorB && ` (${totalScore})`}
        </Button>
      </>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack spacing={(done && allScores) ? 4 : 1} ref={containerRef}>
        {content}
      </Stack>
    </DragDropContext>
  )
}
