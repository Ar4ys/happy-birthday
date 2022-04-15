import React, { FC, useState, createContext, useMemo } from 'react'
import { AssasssinsBackground } from '../../backgrounds/assassins'
import { GenshinBackground } from '../../backgrounds/genshin'
import { SansBackground } from '../../backgrounds/sans'
import { Assassins } from '../Assassins'
import { Editor } from '../Editor'
import { Final } from '../Final'
import { Genshin } from '../Genshin'
import { Sans } from '../Sans'
import { Test } from '../Test'
import './App.css'

const steps = [
  [<SansBackground />, <Sans />],
  [<GenshinBackground />, <Genshin />],
  [<AssasssinsBackground />, <Assassins />],
  [<AssasssinsBackground />, <Test />],
  [<AssasssinsBackground />, <Editor />],
  [<AssasssinsBackground />, <Final />],
]

export const MainContext = createContext({
  globalStep: 0,
  bgVisible: false,
  bgAudio: false,
  setGlobalStep: (() => { }) as React.Dispatch<React.SetStateAction<number>>,
  setBgVisible: (() => { }) as React.Dispatch<React.SetStateAction<boolean>>,
  setBgAudio: (() => { }) as React.Dispatch<React.SetStateAction<boolean>>,
})

export const App: FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [bgVisible, setBgVisible] = useState(false)
  const [bgAudio, setBgAudio] = useState(true)

  const [background, view] = steps[currentStep]

  const contextValue = useMemo(() => ({
    globalStep: currentStep,
    bgVisible,
    bgAudio,
    setGlobalStep: setCurrentStep,
    setBgVisible,
    setBgAudio,
  }), [bgAudio, bgVisible, currentStep])

  return (
    <MainContext.Provider value={contextValue}>
      <div className='App'>
        <div id='background'>{background}</div>
        <main className='mainView'>{view}</main>
      </div>
    </MainContext.Provider>
  )
}
