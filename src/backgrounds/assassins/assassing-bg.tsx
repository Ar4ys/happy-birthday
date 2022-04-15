import { FC, useContext, useEffect, useState } from 'react'
import { Howl, Howler } from 'howler'
import { MainContext } from '../../modules/App'
import './assassins-bg.css'

Howler.volume(0.5)

const AssassinsBgAudio = new Howl({
  src: 'music/assassins-bg.mp3',
  preload: true,
  loop: true
})

export const AssasssinsBackground: FC = () => {
  const { bgVisible, bgAudio, setBgVisible, setGlobalStep } = useContext(MainContext)

  useEffect(() => {
    if (!bgVisible || !bgAudio) {
      AssassinsBgAudio.fade(1, 0, 1)
    }

    if (bgVisible && bgAudio) {
      AssassinsBgAudio.fade(0, 1, 1)
    }
  }, [bgAudio, bgVisible])

  useEffect(() => {
    AssassinsBgAudio.play()
    AssassinsBgAudio.fade(0, 1, 2)

    setTimeout(() => {
      setBgVisible(true)
    }, 100)

    return () => void AssassinsBgAudio.stop()
  }, [setBgVisible])

  return (
    <div className='assassins-background'>
      <video
        className={`assassins-video ${bgVisible ? '' : 'opacity0'}`}
        loop
        muted
        autoPlay
      >
        <source src='video/ezio-bg.mp4' type='audio/mp4' />
        Your browser does not support the audio element.
      </video>
    </div>
  )
}
