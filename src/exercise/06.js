// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {error}
  }

  componentDidCatch() {
    // console.log('Errorboundary: ComponentDidCatch')
  }

  render() {
    // console.log('Errorboundary: render')
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <div role="alert">
          There was an error:
          <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [{error, pokemonData, status}, setState] = React.useState({
    error: null,
    status: 'idle',
    pokemonData: null,
  })
  console.log('running', error, pokemonData, status)

  React.useEffect(() => {
    return () => {
      console.log('Component is unmounted')
    }
  }, [])

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: 'pending', pokemonData: null, error: null})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({status: 'resolved', pokemonData: pokemonData, error: null})
      },
      error => {
        setState({status: 'rejected', pokemonData: null, error: error})
      },
    )
  }, [pokemonName])

  if (status === 'idle') return 'Submit a pokemon'
  else if (status === 'rejected') throw new Error(error.message)
  else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else return <PokemonDataView pokemon={pokemonData} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('pikachu')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
