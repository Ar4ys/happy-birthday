import { FC, useContext, useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import cx from 'classnames'

import { printDebounce, PrintDebounceRef } from '../../utils/utils'
import { TextBox } from './text-box'
import { MainContext } from '../App'
import './assassins.css'

const textStates = [
  `Воо, так то лучше.`,
  `Что ж, этот год прошел ебать не встать как быстро.
Вроде вот недавно только твои 16 праздновали, за ЗНО парились как долбанутые, потом тряслись за поступление в уник...
Какой пиздатый все таки у нас был выпускной - даже с телками :3`,
  `А тут тебе уже 17 стукнуло, сессия вторая с курсовой на носу, войня с нихуя началась, я он в Европу поехал (на тур поездку :) ).`,
  `Время летит как не в себя и, похоже, никто не собирается его останавливать. И в этот миг, пока ты тут, вместе с нами, я хотел бы пожелать:`,
  [
    `- Ты должен быть готов к тому, что можешь быть неправ.`,
    `Жизнь показала, что натура твоя крайне яростная, и от скуки, ради фана, ты готов сделать любую дичь.
Но все же, нужно иметь границы и уметь признавать свое поражение.
Даже когда, казалось бы, ты прав, потому что знать все в этой жизни не возможно... да и не нужно.`
  ],
  [
    `- Законы исходят от здравого мышления, а не от Бога, а потому ничто не истина и всё дозволено.`,
    `В этой жизни подчиняться нужно только одиним законам - законам здравого смысла.
Никто не должен быть тебе указом. Чтобы найти себя нужно жить так, как считаешь нужным ты.
Конечно, советы других людей игнорировать не нужно, "ты должен быть готов к тому, что можешь быть неправ".
Но и слепо верить и следовать им тоже глупо.`
  ],
  [
    `— Наша жизнь прекрасна, брат.`,
    `— Великолепна!`,
    `— Вот бы она никогда не менялась...`,
    `— И никогда не меняла нас.`,
    `Может наша жизнь и не идеальна, а местами крайне несправедлива, но одно в ней неизменимо: наша ебанутость.`,
    `Это уже, своего рода, клише в PEP-е, но от него отказыватся нельзя ни в коем случае:`,
    `Оставайся таким же долбанутым как и всегда. Что бы жизнь тебе не приподносила, какие бы полосы у тебя не наступали -
всегда помни кто ты, кем ты был и кем ты хочешь быть. Всегда оставайся собой.`
  ],
  [
    `На этом философское отступление можно закончить. А теперь перейдем к реально важным вещам.`,
    `Ты научился парсить строку с первого раза? А если проверю? А бабу нашел себе? А в жизни определился?`
  ],
  'А часики то тикают. Время не резиновое, дружок....',
  'В любом случае, даже если на все вопросы выше ты ответил "Нет" (ебать ты ленивая задница тогда) - у меня все равно есть за что похвалить тебя :3',
  `Ебать не встать, спустя почти 17 лет своей жизни ты таки доказал свою компетентность в IT сфере!
Преодолев огромный барьер своей тупости (вспомниная как вы долго ебались с Педро) ты таки смог переустановить Шиндовс сам!
Это могут сделать только достойнешие из достойных, и ты доказал, что ты достоин звания "Ты ж програмист".`,
  `Я, Fullstack веб-калека, награждаю тебя почестным званием "Ты ж програмист". Отныне ты волен кукарекать "Я ж програмист",
а так же чинить компы себе, своим родным, своим близким и друзьям. Amen!`,
  [
    `Так же, хотел бы показать тебе видео, которое очень хорошо описывает тебя. Так что минутка рекламы для нашего спонсора:`,
    `"ШИНДОВС САМ НЕ ПЕРЕУСТАНОВИТСЯ"`
  ],
  // 13
  undefined,
  `Что ж, раз такое дело - сегодня и завтра (какая щедрость) я официально разрешаю тебе кукарекать, что Виндовс лучше и вообще Линукс говно.
Ты, кстати, корзину переименовал в Линукс?`,
  `Ладно, хватит со вступлением, перейдем к самой интересной части - IQ ТЕСТ! Ты готов?`,
  `Да начнется ТЕСТ`,
  `Ну тогда пошел ка ты нахуй!`,
]

const shindowsAudio = new Howl({
  src: 'music/shindows.mp3',
  preload: true
})

export const Assassins: FC = () => {
  const printRef = useRef<PrintDebounceRef>(null)
  const shindowsStartedRef = useRef(false)
  const { bgVisible, setBgAudio, setGlobalStep } = useContext(MainContext)
  const [state, setState] = useState(0)
  const [visible, setVisible] = useState(false)
  const [continueVisible, setContinueVisible] = useState(false)
  const [text, setText] = useState<string[]>([])

  useEffect(() => {
    setTimeout(() => setVisible(true), 4 * 1000)
  }, [])

  useEffect(() => {
    if (visible && state !== 13) {
      if (state === 14) setBgAudio(true)
      const [start, stop] = printDebounce(
        textStates[state],
        (char, _, i) => {
          if (state === 12 && char === '"' && !shindowsStartedRef.current) {
            setBgAudio(false)
            shindowsStartedRef.current = true
            shindowsAudio.play()
          }

          setText(prevText => {
            if (!prevText[i]) prevText[i] = ''
            prevText[i] += char
            return [...prevText]
          })
        },
        { ref: printRef }
      )

      start().then(stoppedMannualy => {
        if (state === 17) {
          setTimeout(() => window.close(), 1000)
          setContinueVisible(false)
          return
        }
        if (!stoppedMannualy) setContinueVisible(true)
      })

      return () => {
        stop()
        setText([])
      }
    }
  }, [setBgAudio, state, visible])

  const handleContinue = () => {
    const { isEnded, skip } = printRef.current ?? {}

    if (!isEnded) return skip?.()
    if (state === 15) return
    if (state === 16) {
      setGlobalStep(3)
      return
    }

    setContinueVisible(false)
    setState(state + 1)
  }
  return (
    <div
      className={cx(
        'assassins-wrapper',
        (bgVisible && visible) || 'opacity0',
        state === 15 && 'assassins-wrapper-iq'
      )}
      onClick={handleContinue}
    >
      {state !== 13 && (
        <TextBox text={text} />
      )}
      {state === 13 && (
        <video
          className='assassins-shindows'
          width={640}
          height={360}
          onEnded={() => setContinueVisible(true)}
          autoPlay
          controls
        >
          <source src='video/shindows.mp4' type='audio/mp4' />
          Your browser does not support the video element.
        </video>
      )}
      <div className='assassins-button-wrapper'>
        {state !== 15 && (
          <button
            className={cx('assassins-button', continueVisible || 'opacity0')}
            onClick={handleContinue}
          >
            Продолжить
          </button>
        )}
        {state === 15 && (<>
          <button
            className={cx('assassins-button assassins-button-iq', continueVisible || 'opacity0')}
            onClick={() => {
              setState(16)
              setContinueVisible(false)
            }}
          >
            Ебать го
          </button>
          <button
            className={cx('assassins-button assassins-button-iq', continueVisible || 'opacity0')}
            onClick={() => {
              setState(17)
              setContinueVisible(false)
            }}
          >
            Нахуй пошел
          </button>
        </>)}
      </div>
    </div>
  )
}
