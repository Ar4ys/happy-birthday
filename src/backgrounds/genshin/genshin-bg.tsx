import { FC, useContext, useEffect, useState } from 'react'
import { Howl, Howler } from 'howler'
import './genshin-bg.css'
import { MainContext } from '../../modules/App'

Howler.volume(0.5)

const GenshinBgAudio = new Howl({
  src: 'music/genshin-bg.mp3',
  preload: true,
  loop: true
})

const GenshinBgNoiseAudio = new Howl({
  src: 'music/genshin-bg-noise.mp3',
  preload: true,
  loop: true
})

export const GenshinBackground: FC = () => {
  const { bgVisible, setBgVisible } = useContext(MainContext)

  useEffect(() => {
    if (!bgVisible) {
      GenshinBgAudio.fade(1, 0, 1)
      GenshinBgNoiseAudio.fade(1, 0, 1)
    }
  }, [bgVisible])

  useEffect(() => {
    GenshinBgAudio.play()
    GenshinBgNoiseAudio.play()
    GenshinBgAudio.fade(0, 1, 2)
    GenshinBgNoiseAudio.fade(0, 1, 2)

    setTimeout(() => {
      setBgVisible(true)
    }, 100)

    return () => {
      GenshinBgAudio.stop()
      GenshinBgNoiseAudio.stop()
    }
  }, [setBgVisible])

  return (
    <div className='genshin-background'>
      <video
        className={`genshin-video ${bgVisible ? '' : 'opacity0'}`}
        poster='img/genshin-bg.jpg'
        loop
        muted
        autoPlay
      >
        <source src='video/genshin-bg.mp4' type='audio/mp4' />
        Your browser does not support the audio element.
      </video>
    </div>
  )
}
