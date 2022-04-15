import { FC } from 'react'
import cx from 'classnames'

const PlayIcon: FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3,22.0000002 L21,12 L3,2 L3,22.0000002 Z M5,19 L17.5999998,11.9999999 L5,5 L5,19 Z M7,16 L14.1999999,12 L7,8 L7,16 Z M9,13 L10.8,12 L9,11 L9,13 Z" />
  </svg>
)

interface TextBoxProps {
  className?: string
  text: string | string[]
  onClick?: () => void
}

export const TextBox: FC<TextBoxProps> = ({ text, className, onClick }) => {
  text = Array.isArray(text) ? text : [text]

  return (
    <div
      className={cx('editor-textbox', className)}
      onClick={onClick}
    >
      {text.map(a => <p key={a} className='editor-textbox-text'>{a}</p>)}
    </div>
  )
}

interface TerminalProps {
  className?: string
  text: string
  onClick?: () => void
}

export const Terminal: FC<TerminalProps> = ({ text, className, onClick }) => {
  return (
    <div
      className={cx(
        'editor-textbox',
        'editor-textbox-terminal',
        className
      )}>
      <button
        className='editor-terminal-button'
        onClick={onClick}
      >
        <PlayIcon fill='green' className='editor-terminal-button-icon' />
        Запустить
      </button>
      <pre className='editor-terminal-text'>{text}</pre>
    </div>
  )
}
