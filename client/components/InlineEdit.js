/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react'
import useKeypress from '../hooks/useKeypress'
import useOnClickOutside from '../hooks/useOnClickOutside'

function InlineEdit(props) {
  const [isInputActive, setIsInputActive] = useState(false)
  const [inputValue, setInputValue] = useState(props.text)

  const wrapperRef = useRef(null)
  const textRef = useRef(null)
  const inputRef = useRef(null)

  const enter = useKeypress('Enter')
  const esc = useKeypress('Escape')

  // check to see if the user clicked outside of this component
  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      props.onSetText(inputValue)
      setIsInputActive(false)
    }
  })

  // focus the cursor in the input field on edit start
  useEffect(() => {
    if (isInputActive) {
      inputRef.current.focus()
    }
  }, [isInputActive])

  useEffect(() => {
    if (isInputActive) {
      // if Enter is pressed, save the text and case the editor
      if (enter) {
        props.onSetText(inputValue)
        setIsInputActive(false)
      }
      // if Escape is pressed, revert the text and close the editor
      if (esc) {
        setInputValue(props.text)
        setIsInputActive(false)
      }
    }
  }, [enter, esc]) // watch the Enter and Escape key presses

  return (
    <span className="inline-text" ref={wrapperRef}>
      <span
        ref={textRef}
        onClick={() => setIsInputActive(true)}
        className={`${!isInputActive ? 'block' : 'hidden'}`}
      >
        {props.text}
      </span>
      <input
        ref={inputRef}
        style={{ minWidth: `${Math.ceil(inputValue.length)}ch` }}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
        }}
        className={`${isInputActive ? 'block' : 'hidden'}`}
      />
    </span>
  )
}

export default InlineEdit
