import { useEffect, useState } from "react";

export function useDictionary() {
  const [ready, setReady] = useState(false)
  const [words, setWords] = useState(new Set())

  useEffect(() => {
    Promise.all([
      fetch('wordsEn.txt'),
      fetch('corncob_lowercase.txt'),
    ].map((p) => p.then((res) => res.text()))).then((dicts) => {
      const words = dicts
        .flatMap((dict) => dict.split('\n'))
        .filter((word) => word.match(/^[a-z]+$/))
      setWords(new Set(words))
      setReady(true)
    })
  }, [])

  return { ready, words }
}
