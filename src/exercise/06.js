// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error:
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>RESET</button>
    </div>
  );
}

function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  });
  const { status, pokemon, error } = state;

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setState({ status: 'pending' });
    fetchPokemon(pokemonName).then(
      (pokemon) => {
        setState({ status: 'resolved', pokemon });
      },
      (error) => {
        setState({ status: 'rejected', error });
      }
    );
  }, [pokemonName]);

  if (status === 'idle') {
    return 'Submit a name';
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (status === 'rejected') {
    // This will be handled by our error boundary
    throw error;
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />;
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          setPokemonName('');
        }}
        resetKeys={[pokemonName]}
      >
        <div className="pokemon-info">
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
