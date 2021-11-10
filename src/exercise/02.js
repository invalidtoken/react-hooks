// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
  key,
  initialState,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const prevKeyRef = React.useRef(key)
  const [value, setValue] = React.useState(() => {
    const localStorageName =
      window.localStorage && window.localStorage.getItem(key)
    if (localStorageName) {
      return deserialize(localStorageName)
    }
    return typeof initialState === 'function' ? initialState() : initialState
  })

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }

    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(value))
  }, [key, serialize, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Sahil" />
}

export default App
