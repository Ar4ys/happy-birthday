export function sleep(time: number) {
  return new Promise<void>(res => {
    const id = setTimeout(() => {
      clearTimeout(id)
      res()
    }, time)
  })
}

export const waitLongerAfter = [':', ';', '.', ',', '!', '?', '\n', '\t']

export interface PrintDebounceRef {
  start: () => Promise<boolean>
  stop: () => void
  skip: () => void
  isEnded: boolean
}

export function printDebounce(
  sentences: string | string[] | undefined,
  cb: (value: string, isWaiting: boolean, index: number) => void,
  {
    time = 60,
    waitTime = 500,
    ref = {} as React.Ref<PrintDebounceRef>
  } = {}
) {
  let shouldStop = false
  let shouldSkip = false

  const refObj: PrintDebounceRef = {
    isEnded: false,
    async start() {
      if (!sentences) {
        refObj.isEnded = true
        return false
      }
      sentences = Array.isArray(sentences) ? sentences : [sentences]
      let i = 0
      for (const sentence of sentences) {
        let prevChar = ''
        for (const char of sentence) {
          if (shouldStop) {
            refObj.isEnded = true
            return true
          }

          if (shouldSkip) {
            cb(char, false, i)
            await sleep(5)
            continue
          }

          if (waitLongerAfter.includes(char)
            || (char === '-' && waitLongerAfter.concat(' ').includes(prevChar))
          ) {
            cb(char, true, i)
            // Special char if we want to pronounce every character separate
            if (char === '\t') await sleep(100)
            else await sleep(waitTime)
          } else {
            cb(char, false, i)
            await sleep(time)
          }

          prevChar = char
        }

        i++
      }

      refObj.isEnded = true
      return false
    },

    stop() {
      shouldStop = true
    },

    skip() {
      shouldSkip = true
    }
  }

  if (typeof ref === 'function') ref(refObj)
  else if (ref) (ref.current as any) = refObj

  return [
    refObj.start,
    refObj.stop,
    refObj.skip,
    refObj.isEnded
  ] as const
}
