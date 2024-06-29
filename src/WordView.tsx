import { Box, Stack } from '@mui/material'
import React from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import type { Letter } from './GameContext.ts'
import { LetterView } from './LetterView.tsx'

export function WordView({
  id,
  letters,
  error,
  width = 600,
  hideOutline,
}: {
  id: string
  letters: Array<Letter>
  error?: boolean
  width?: number
  hideOutline?: boolean
}) {
  const size = Math.min(70, (width * 0.8)/letters.length)
  return (
    <Droppable droppableId={id} direction="horizontal">
      {(dropProvided, _dropSnapshot) => (
        <Box
          display="flex"
          flexDirection="row"
          height="70px"
          ref={dropProvided.innerRef}
          {...dropProvided.droppableProps}
          borderRadius={width * 0.004}
          padding={width * 0.001}
          justifyContent="flex-start"
          alignItems="center"
          style={{
            border: hideOutline ? undefined : `1px solid ${error ? 'red' : 'gray'}`,
          }}
        >
          {letters.map((letter, i) => (
            <Draggable index={i} key={letter.id} draggableId={letter.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <LetterView key={letter.id} letter={letter} size={size} />
                </div>
              )}
            </Draggable>
          ))}
          {dropProvided.placeholder}
        </Box>
      )}
    </Droppable>
  )
}
