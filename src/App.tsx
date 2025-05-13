import React, { useEffect, useMemo, useState } from 'react';
import { SearchWrapper } from './Components/SearchWrapper';
import { FilterProvider } from './util/FilterContext';


import './App.css';

export function App() {

  const [store, setStore] = useState([]);

  function handleStoreOnClick(event) {
    event.preventDefault();
    if (event?.target?.value) {
      const value = event.target.value;
      setStore(currentArray => {
        const index = currentArray.indexOf(value);
        return index !== -1
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
      });
    }
  }

  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">instantsearch-context-plp</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/instantsearch/tree/master/packages/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <FilterProvider store={store}>
          <SearchWrapper store={store} onStoreClick={handleStoreOnClick} />
        </FilterProvider>
      </div>
    </div>
  );
}