import { FC } from 'react'

interface Props {
  text: string | string[]
  onClick?: () => void
}

export const TextBox: FC<Props> = ({ text, onClick }) => {
  text = Array.isArray(text) ? text : [text]

  return (
    <div className='genshin-textbox' onClick={onClick}>
      {text.map(a => <p key={a} className='genshin-textbox-text'>{a}</p>)}
    </div>
  )
}
