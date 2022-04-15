import { FC, ReactNode } from 'react'

interface Props {
  icon: ReactNode
  text: string | string[]
  onClick?: () => void
}

export const TextBox: FC<Props> = ({ icon, text, onClick }) => {
  text = Array.isArray(text) ? text : [text]

  return (
    <div className='sans-textbox' onClick={onClick}>
      <div className='sans-textbox-icon'>
        {icon}
      </div>
      <div>
        {text.map(a => <p key={a} className='sans-textbox-text'>{a}</p>)}
      </div>
    </div>
  )
}
