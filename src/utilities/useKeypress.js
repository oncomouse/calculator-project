// Based on: https://github.com/jacobbuck/react-use-keypress/blob/3fac6bfc03b26a9afabe421aa5cdd4c0f6561ff2/src/shimKeyboardEvent.js#L22
import { useEffect, useRef } from 'react'
import shimKeyboardEvent from './shimKeyboardEvent'

const useKeypress = (keys) => {
  const eventListenerRef = useRef()

  useEffect(() => {
    eventListenerRef.current = (event) => {
      shimKeyboardEvent(event)
      keys[event.key](event)
    }
  }, [keys])

  useEffect(() => {
    const eventListener = (event) => {
      eventListenerRef.current(event)
    }
    window.addEventListener('keydown', eventListener)
    return () => {
      window.removeEventListener('keydown', eventListener)
    }
  }, [])
}

export default useKeypress
