import { Box } from '@mui/material'
import React from 'react'
import type { Letter } from './GameContext'

export function LetterView({ letter, size }: { letter: Letter, size: number }) {
  return (
    <Box
      border="1px solid gray"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      sx={{
        transition: 'all ease 0.3s',
        background: 'white',
        touchAction: 'none',
      }}
      style={{
        width: size,
        height: size,
        marginLeft: size*0.02,
        marginRight: size*0.02,
        borderRadius: size * 0.095,
      }}
    >
      <Box sx={{ display: 'inline' }} style={{ fontSize: size * 0.65 }}>
        {letter.letter.toUpperCase()}
      </Box>
      <Box sx={{
        display: 'inline',
        position: 'absolute',
        right: 3,
        bottom: 3,
      }} style={{ fontSize: size * 0.2 }}>
        {letter.score}
      </Box>
    </Box>
  )
}
