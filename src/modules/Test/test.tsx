import {
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  type PropsWithChildren,
  type ChangeEvent,
  type FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import cx from 'classnames'

import { printDebounce, PrintDebounceRef } from '../../utils/utils'
import { TextBox } from './text-box'
import { MainContext } from '../App'
import './test.css'

const textStates = [
  //0
  `Первый тест будет крайне прост - сколько будет 84/4(-5+12)?`,
  `Ты нахуя буквы пишешь? Тут только цифры нужны!`,
  `Молодец, порядок действий знаешь. Вот только ответ не верный :3`,
  `Математику значит знаешь хорошо - молодец!`,
  `Ты тупой? Ты как ЗНО сдал?`,

  // 5
  `Какая основная файловая система Windows?`,
  `Не нихуя`,
  `И это правильный ответ! Вы выиграли АВТОМОБИЛЬ... Так стоп, дургая программа.`,

  // 8
  `Сказал в голос Паляниця. БЫСТРО СКАЗАЛ ПАЛАНИЦЯ.`,
  `ВАЛИ РАШИСТА СУКА, ВАЛИ ГАДА НАХУЙ`,
  `Ну смотри мне... Я слежу за тобой!`,

  // 11
  `И последний, самый сложный тест в твоей жизни.
От него зависит твое будущее, будущее твоих детей, внуков, правнуков, прпрпавнуков, и воообще всего мира в целом.
Ты готов?`,
  // 12
  undefined,
  // 13
  undefined,

  // 14
  `Відомо, що у рядку є латинські (англійські) букви і цифри.
Перетворити рядок так, щоб спочатку розміщувалися цифри у прямому порядку, а потім літери у зворотному порядку.
Якщо рядок містив також інші символи (не букви й не цифри), їх слід пропустити (видалити).`
]

interface RadioButtonProps extends PropsWithChildren<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> {
  className?: string,
  inputClassName?: string
  htmlFor?: string,
}

const RadioButton: FC<RadioButtonProps> = ({ className, inputClassName, htmlFor, value, children, ...props }) => (
  <label
    className={cx('test-radio', className)}
    htmlFor={htmlFor}
  >
    <input type='radio' className={inputClassName} value={value} {...props} />
    {children || value}
  </label>
)

export const Test: FC = () => {
  const printRef = useRef<PrintDebounceRef>(null)
  const { bgVisible, setBgVisible, setBgAudio, setGlobalStep } = useContext(MainContext)
  const [state, setState] = useState(0)
  const [visible, setVisible] = useState(false)
  const [submitVisible, setSubmitVisible] = useState(false)
  const [inputVisible, setInputVisible] = useState(false)
  const [text, setText] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setTimeout(() => setVisible(true), 4 * 1000)
  }, [])

  useEffect(() => {
    if (!visible) return

    const [start, stop] = printDebounce(
      textStates[state],
      (char, _, i) => {
        setText(prevText => {
          if (!prevText[i]) prevText[i] = ''
          prevText[i] += char
          return [...prevText]
        })
      },
      { ref: printRef }
    )

    start().then(stoppedMannualy => {
      setInputVisible(true)
      if ([1, 2, 4].includes(state)) setTimeout(() => setState(0), 3000)
      if (state === 6) setTimeout(() => setState(5), 3000)
      if (state === 9) setTimeout(() => window.close(), 1000)
      if (state === 11) setSubmitVisible(true)
      if (state === 12) setTimeout(() => window.close(), 2000)
    })

    return () => {
      stop()
      setText([])
    }
  }, [setBgAudio, state, visible])

  const handleContinue = () => {
    const { isEnded, skip } = printRef.current ?? {}
    if (!isEnded) return skip?.()
    return true
  }

  const handleSubmit = (_?: unknown, value?: unknown) => {
    // if (state === textStates.length - 1) {
    //   setBgVisible(false)
    //   setTimeout(() => setGlobalStep(4), 2000)
    //   return
    // }

    if (!handleContinue()) return

    switch (state) {
      case 0: {
        const result = Number(inputValue)

        if (isNaN(result)) {
          setState(1)
        } else if (result === 84 / 4 * (-5 + 12)) {
          setState(2)
        } else if (result === 84 / (4 * (-5 + 12))) {
          // Correct
          setState(3)
        } else {
          setState(4)
        }

        break
      }

      case 3:
        setState(5)
        setSubmitVisible(false)
        setInputValue('')
        break

      case 5: {
        // Correct
        if (inputValue === 'NTFS') setState(7)
        else setState(6)
        break
      }

      case 7:
        setState(8)
        setSubmitVisible(false)
        setInputValue('')
        break

      case 8:
        // Correct
        if (inputValue.toLowerCase().trim() === 'паляниця') setState(10)
        else setState(9)
        break

      case 10:
        setState(11)
        setSubmitVisible(false)
        setInputValue('')
        break

      case 11:
        // Correct
        if (value) setState(13)
        else setState(12)
        break

      case 13:
        setGlobalStep(4)
        setSubmitVisible(false)
        setInputValue('')
        break
    }

  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    setSubmitVisible(true)
  }

  return (<>
    <div
      className={cx(
        'test-wrapper',
        (bgVisible && visible) || 'opacity0',
      )}
      onClick={handleContinue}
    >
      {![12, 13].includes(state) && (
        <TextBox text={text} />
      )}
      {[12, 13].includes(state) && (
        <img src={state === 12 ? 'img/slab.jpg' : 'img/dostoin.jpg'} width={580} height={250} alt='text' />
      )}
    </div>
    {state <= 8 && (
      <div
        className={cx(
          'test-wrapper',
          (bgVisible && visible && inputVisible) || 'opacity0',
        )}
      >
        {state < 5 && (
          <input className='test-input' onChange={handleChange} value={inputValue} />
        )}
        {state >= 5 && state <= 7 && (<>
          <RadioButton name='win-fs' onChange={handleChange} value='FAT32' />
          <RadioButton name='win-fs' onChange={handleChange} value='EXT4' />
          <RadioButton name='win-fs' onChange={handleChange} value='FS' />
          <RadioButton name='win-fs' onChange={handleChange} value='NTFS' />
        </>)}
        {state === 8 && (
          <input className='test-input' onChange={handleChange} value={inputValue} />
        )}
      </div>
    )}
    <div
      className={cx(
        'test-button-wrapper',
        submitVisible || 'opacity0',
        state === 11 && 'test-button-wrapper-cs'
      )}
    >
      {state !== 11 && (
        <button
          className='test-button'
          onClick={handleSubmit}
        >
          Продолжить
        </button>
      )}
      {state === 11 && (<>
        <button
          className='test-button test-button-cs'
          onClick={() => handleSubmit(null, true)}
        >
          Да
        </button>
        <button
          className='test-button test-button-cs'
          onClick={() => handleSubmit(null, false)}
        >
          Нет
        </button>
      </>)}
    </div>
  </>)
}

{
  const code = `
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Hello, world!");
        Console.WriteLine(args);
    }
}
`

  // fetch(`http://api.paiza.io:80/runners/create?source_code=${encodeURIComponent(code)}&language=csharp&longpoll=false&api_key=guest`, {
  //   method: 'POST',
  // }).then(res => res.json()).then(console.log)
}
