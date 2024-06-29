import { XORShift } from 'random-seedable'
import { v4 } from 'uuid'

const interval = 1000 * 60 * 60 * 24 // 24 hours in milliseconds
const startOfDay = Math.floor(Date.now() / interval) * interval

export function makeLetters() {
  const random = new XORShift(startOfDay + 2)

  const letters = []
  for (const set of [
    { score: 1, count: 4, letters: ['l', 's', 'u'] },
    { score: 1, count: 6, letters: ['n', 'r', 't'] },
    { score: 1, count: 8, letters: ['o'] },
    { score: 1, count: 9, letters: ['a', 'i'] },
    { score: 1, count: 12, letters: ['e'] },
    { score: 2, count: 3, letters: ['g'] },
    { score: 2, count: 4, letters: ['d'] },
    { score: 3, count: 2, letters: ['b', 'c', 'm', 'p'] },
    { score: 4, count: 2, letters: ['f', 'h', 'v', 'w', 'y'] },
    { score: 5, count: 1, letters: ['k'] },
    { score: 8, count: 1, letters: ['j', 'x'] },
    { score: 10, count: 1, letters: ['q', 'z'] },
  ]) {
    for (const letter of set.letters) {
      for (let i = 0; i < set.count; i++) {
        letters.push({
          letter,
          score: set.score,
          id: v4(),
        })
      }
    }
  }

  const picked = []
  for (let i = 0; i < 12; i++) {
    const idx = Math.floor(random.float() * letters.length)
    const [letter] = letters.splice(idx, 1)
    picked.push(letter)
  }

  return picked
}

export function scoreWord(word) {
  return word.reduce((acc, next) => acc + next.score, 0)
}

export function wordsUsingLetters(letters, dictionary) {
  const counts = {}
  for (const letter of letters) {
    counts[letter.letter] = (counts[letter.letter] || 0) + 1
  }

  const res = []
  const matcher = new RegExp("\\b[" + letters.map((l) => l.letter).join('') + "]+\\b")
  for (const word of dictionary.values()) {
    if (matcher.exec(word)) {
      const wordCounts = { ...counts }
      let ok = true
      for (let i = 0; i < word.length; i++) {
        const char = word[i]
        if (!wordCounts[char]) {
          ok = false
          break
        }
        wordCounts[char]--
      }
      if (ok) {
        res.push(word)
      }
    }
  }
  return res
}

export function remainingLetters(letters, word) {
  const remaining = [...letters]
  for (const char of word.split('')) {
    remaining.splice(remaining.findIndex((l) => l.letter === char), 1)
  }
  return remaining
}

export function validPairs(letters, dictionary) {
  const pairs = []
  const wordAs = wordsUsingLetters(letters, dictionary)
  for (const wordA of wordAs) {
    const remaining = remainingLetters(letters, wordA)
    const wordBs = wordsUsingLetters(remaining, dictionary)
    for (const wordB of wordBs) {
      pairs.push([wordA, wordB])
    }
  }
  debugger
  return pairs
}
