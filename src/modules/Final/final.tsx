import { FC, useContext, useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import { printDebounce, PrintDebounceRef } from '../../utils/utils'
import { TextBox } from './text-box'
import { MainContext } from '../App'
import './final.css'

const textStates = [
  [
    `Ну что ж. Вот ты и прошел эту сложнейшую полосу препятствий на пути к своему подарку. Я надеюсь тебе понравился такой формат :3
В любом случае, дуржище, Амирко, Peroguste (или как там...), пидорок ты наш - оставайся таким же необыкновенным и ебаннутым какой ты есть.
Мы за это тебя и любим (вчерашний стояк тому подтверждение) :3`,
    `Кстати, посмотри в Котобанк - там презент.`,
  ]
]

export const Final: FC = () => {
  const printRef = useRef<PrintDebounceRef>(null)
  const { bgVisible, setBgAudio } = useContext(MainContext)
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState<string[]>([])

  useEffect(() => {
    setTimeout(() => setVisible(true), 3 * 1000)
  }, [])

  useEffect(() => {
    if (visible) {
      const [start, stop] = printDebounce(
        textStates[0],
        (char, _, i) => {
          setText(prevText => {
            if (!prevText[i]) prevText[i] = ''
            prevText[i] += char
            return [...prevText]
          })
        },
        { ref: printRef }
      )

      start()

      return () => {
        stop()
        setText([])
      }
    }
  }, [setBgAudio, visible])

  const handleContinue = () => {
    const { isEnded, skip } = printRef.current ?? {}
    if (!isEnded) return skip?.()
  }

  return (
    <div
      className={cx(
        'assassins-wrapper',
        (bgVisible && visible) || 'opacity0',
      )}
      onClick={handleContinue}
    >
      <TextBox text={text} />
    </div>
  )
}
