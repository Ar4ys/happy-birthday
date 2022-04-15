import { FC, useContext, useEffect, useState } from 'react'
import { printDebounce } from '../../utils/utils'
import { TextBox } from './text-box'
import { MainContext } from '../App'
import './genshin.css'

const textStates = [
  'Какой чудесный на улице день. Птички поют, цветочки благоухают.',
  'Одна из них мне на ушко нашептала, что сегодня...',
  'У одного пидорка День Рождения!',
  'Поздравляю тебя, мой не такой уж и юный друг, с 17 днем рождения!',
  'Ты уже на год ближе к превращению в деда! Какая жалость...',
  'Нус, давай не будем о грустном, сегодня все таки твой день :3',
  'Как тебе бекграунд? Я старался.... ТАК БЛЯТЬ. Кто включил Гейшин?! МИША БЛЯТЬ!!!'
]


export const Genshin: FC = () => {
  const { bgVisible, setBgVisible, setGlobalStep } = useContext(MainContext)
  const [state, setState] = useState(0)
  const [visible, setVisible] = useState(false)
  const [continueVisible, setContinueVisible] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    setTimeout(() => setVisible(true), 4 * 1000)
  })

  useEffect(() => {
    if (visible && state <= textStates.length) {
      const [start, stop] = printDebounce(
        textStates[state],
        char => setText(prevText => prevText + char)
      )

      start().then(stoppedMannualy => {
        if (!stoppedMannualy) setContinueVisible(true)
      })

      return () => {
        stop()
        setText('')
      }
    }
  }, [state, visible])

  const handleContinue = () => {
    if (state === 7) {
      setBgVisible(false)
      setTimeout(() => setGlobalStep(2), 2000)
      return
    }

    setContinueVisible(false)
    setState(state + 1)
  }
  return (
    <div
      className={`genshin-wrapper ${bgVisible && visible ? '' : 'opacity0'}`}
      onClick={handleContinue}
    >
      {state < 7 && (
        <TextBox text={text} />
      )}
      {state === 7 && (
        <video
          className='genshin-misha'
          width={640}
          height={360}
          autoPlay
          onEnded={() => setContinueVisible(true)}
        >
          <source src='video/misha.mp4' type='audio/mp4' />
          Your browser does not support the video element.
        </video>
      )}
      <button
        className={`genshin-button ${continueVisible ? '' : 'opacity0'}`}
        onClick={handleContinue}
      >
        {state === 7 ? 'Давай по новой' : 'Продолжить'}
      </button>
    </div>
  )
}
