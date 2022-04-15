import { FC, useContext, useEffect, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'
import cx from 'classnames'
import { printDebounce, sleep, waitLongerAfter } from '../../utils/utils'
import { TextBox } from './text-box'
import { MainContext } from '../App'
import './sans.css'

const textStates = [
  'Какой чудесный на улице день: птички поют, цветочки благоухают.',
  'В такие дни дети, как ты, Д\tО\tЛ\tЖ\tН\tЫ\t Г\tО\tР\tЕ\tТ\t Ь\t В\t А\tД\tУ!',
  undefined,
  'А ой... Это не ты?',
  'Бля братан, прости что напугал. Я тебя перепутал с одним фриком. Надеюсь у тебя серце в КОСТИ не ушло?',
  'Ладно, хватит на сегодня шуток, ща отправлю тебя куда нужно.'
]

Howler.volume(0.5)

const SansSpeechAudio = new Howl({
  src: 'music/voice_sans.wav',
  preload: true
})

const SansBirdsAudio = new Howl({
  src: 'music/sans-birds.mp3',
  preload: true,
  loop: true
})

const SansBgAudio = new Howl({
  src: 'music/sans-bg.mp3',
  preload: true,
  loop: true
})

export const Sans: FC = () => {
  const { setGlobalStep } = useContext(MainContext)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [continueVisible, setContinueVisible] = useState(false)
  const [state, setState] = useState(-1)
  const [text, setText] = useState('')

  useEffect(() => {
    if (state === 0 || state === 1 || state >= 3) {
      if (state === 0) SansBirdsAudio.play()
      if (state === 3) {
        SansBgAudio.play()
      }

      const [start, stop] = printDebounce(
        textStates[state],
        char => {
          if (!waitLongerAfter.includes(char) && char !== ' ') SansSpeechAudio.play()
          setText(prevText => prevText + char)
        }
      )

      start()
        .then(async (stoppedMannualy) => {
          if (state === 1) {
            SansBirdsAudio.stop()
            await sleep(100)
            setState(2)
            await sleep(10)
            iframeRef.current?.focus()
          }

          if (!stoppedMannualy) setContinueVisible(true)
        })

      return () => {
        stop()
        setText('')
      }
    }

    if (state === 2) {
      setTimeout(() => {
        setContinueVisible(true)
      }, 3 * 60 * 1000)
      // }, 1000)
    }
  }, [state])

  const handleContinue = () => {
    setContinueVisible(false)
    if (state === 5) {
      SansBgAudio.stop()
      setGlobalStep(p => p + 1)
    } else {
      setState(p => p + 1)
    }
  }

  return (
    <div className='sans-wrapper'>
      {state === -1 && (
        <button className='sans-button' onClick={() => setState(p => p + 1)}>
          Lets gooooo
        </button>
      )}
      {(state === 0 || state === 1) && (
        <TextBox
          icon={<img src='img/icon-256.png' alt='sans' width={75} />}
          text={text}
          onClick={() => setState(p => p + 1)}
        />
      )}
      {state < 3 && (
        <iframe
          ref={iframeRef}
          className={cx('sans-iframe', state < 2 && 'hidden')}
          title='Sans fight'
          src='https://jcw87.github.io/c2-sans-fight/'
          width={640}
          height={480}
        />
      )}
      {state >= 3 && (
        <TextBox
          icon={<img src='img/icon-256.png' alt='sans' width={75} />}
          text={text}
          onClick={handleContinue}
        />
      )}
      <button
        className={cx(
          'sans-button',
          state === 2 && 'sans-button-fuck',
          state !== 2 && 'sans-button-continue',
          !continueVisible && 'opacity0'
        )}
        onClick={handleContinue}
      >
        {state === 2 ? 'В пизду' : 'Продолжить'}
      </button>
    </div>
  )
}
