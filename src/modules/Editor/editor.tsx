import {
  type FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import MonacoEditor, { type Monaco } from '@monaco-editor/react'
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

import { printDebounce, PrintDebounceRef, sleep } from '../../utils/utils'
import { Terminal, TextBox } from './text-box'
import { MainContext } from '../App'
import './editor.css'

type StandaloneEditor = monaco.editor.IStandaloneCodeEditor

const testInput = 'k4r*s1il;kjasd9(rs*134Lafr'
const correctOutput = '431914*;(*rfaLsrdsajklisrk'

const defaultCode = `using System;

public class Program {
  public static void Main(string[] args) {
    // Write code here
  }
}
`

const buildCreateURL = (code: string) => (
  `https://api.paiza.io/runners/create?source_code=${encodeURIComponent(code)}&input=${encodeURIComponent(testInput)}&language=csharp&longpoll=false&api_key=guest`
)

const buildStatusURL = (id: string) => (
  `https://api.paiza.io/runners/get_details?id=${encodeURIComponent(id)}&api_key=guest`
)
const textStates = [
  `Відомо, що у рядку є латинські (англійські) букви і цифри.
Перетворити рядок так, щоб спочатку розміщувалися цифри у непрямому порядку, потім інші симовли у прямому порядку,
а в кінці літери у непрямому порядку.`
]


interface PaizaCreateResponse {
  id: string
  status: 'running' | 'completed'
  error?: string
}

interface PaizaStatusResponse {
  id: string
  language: string
  note: unknown
  status: 'running' | 'completed'

  build_stdout: string
  build_stderr: string
  build_exit_code: number
  build_time: string
  build_memory: number
  build_result: 'success' | 'failure' | 'error'

  stdout: string
  stderr: string
  exit_code: number
  time: number
  memory: number
  result: 'success' | 'failure' | 'error'
}

export const Editor: FC = () => {
  const printRef = useRef<PrintDebounceRef>(null)
  const editorRef = useRef<StandaloneEditor>()
  const monacoRef = useRef<Monaco>()
  const { setGlobalStep } = useContext(MainContext)
  const [text, setText] = useState<string[]>([])
  const [terminalText, setTerminalText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    if (isCorrect) {
      setTimeout(() => {
        setGlobalStep(5)
      }, 2000)
    }
  }, [isCorrect, setGlobalStep])

  useEffect(() => {
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

    start().then(stoppedMannualy => { })

    return () => {
      stop()
    }
  }, [])

  const handleContinue = () => {
    const { isEnded, skip } = printRef.current ?? {}
    if (!isEnded) return skip?.()
    return true
  }

  const handleSubmit = async () => {
    handleContinue()
    if (!editorRef.current) return
    if (isLoading) return setTerminalText(p => p + 'Loading... Жди блять\n')

    setTerminalText(p => p + 'Running code...\n')

    try {
      setIsLoading(true)
      const code = editorRef.current.getValue()
      const response = await fetch(buildCreateURL(code), {
        method: 'POST',
      })

      if (!response.ok) {
        setTerminalText(p => p + `Error RES_Stop_00000A: Response error, see console for more info\n`)
        console.log('Error response', response)

      }

      const createData = await response.json() as PaizaCreateResponse

      if (createData.error) {
        setTerminalText(p => p + `Error Create_Runner_Stop_00000A: \n${createData.error} \n`)
        console.log(createData.error)
        return
      }

      while (true) {
        const response = await fetch(buildStatusURL(createData.id))
        const statusData = await response.json() as PaizaStatusResponse

        if (statusData.status === 'completed') {
          if (statusData.result === 'success') {
            const stdErr = statusData.stderr ? statusData.stderr + '\n' : ''
            const stdOut = statusData.stdout ? statusData.stdout + '\n' : ''
            let terminalText = `Program output: \n${stdErr}${stdOut} \n`

            if (statusData.stdout.includes(correctOutput)) {
              terminalText += 'Result: Correct!\n'
              setIsCorrect(true)
            } else {
              terminalText += 'Result: Incorrect!\n'
            }

            setTerminalText(p => p + terminalText)
          } else if (statusData.result === 'failure') {
            let terminalText = ''

            if (statusData.stderr || statusData.stdout) {
              const stdErr = statusData.stderr ? statusData.stderr + '\n' : ''
              const stdOut = statusData.stdout ? statusData.stdout + '\n' : ''
              terminalText += `Program output: \n${stdErr}${stdOut} \n`
            }

            setTerminalText(p => p + terminalText)
          } else if (statusData.result === 'error') {
            setTerminalText(p => p + `Error Runner_Failure_Stop_00000A: \n${JSON.stringify(statusData, undefined, 2)} \n`)
          } else if (statusData.build_result === 'failure') {
            let terminalText = ''

            if (statusData.build_stderr || statusData.build_stdout) {
              const stdErr = statusData.build_stderr ? statusData.build_stderr + '\n' : ''
              const stdOut = statusData.build_stdout ? statusData.build_stdout + '\n' : ''
              terminalText += `Build output: \n${stdErr}${stdOut} \n`
            }

            setTerminalText(p => p + terminalText)
          } else if (statusData.build_result === 'error') {
            setTerminalText(p => p + `Error Runner_Failure_Stop_00000A: \n${JSON.stringify(statusData, undefined, 2)} \n`)
          } else {
            setTerminalText(p => p + `Error Runner_Failure_Stop_00000A: \n${JSON.stringify(statusData, undefined, 2)} \n`)
          }

          setIsLoading(false)
          break
        } else await sleep(500)
      }
    } catch (e) {
      setTerminalText(p => p + `Error Stop_00000A: see console for more info, preview: \n${JSON.stringify(e, undefined, 2)} \n`)
      console.log(e)
    }
  }

  const handleEditorDidMount = (editor: StandaloneEditor, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
  }

  return (
    <div className='editor-wrapper'>
      <div className='editor-wrapper-left'>
        <TextBox text={text} onClick={handleContinue} />
        <Terminal text={terminalText} onClick={handleSubmit} />
      </div>
      <MonacoEditor
        height='90%'
        width='55%'
        defaultLanguage='csharp'
        theme='vs-dark'
        defaultValue={defaultCode}
        onMount={handleEditorDidMount}
      />
    </div>
  )
}
