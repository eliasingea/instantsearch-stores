import React, { useEffect, useMemo, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  DynamicWidgets,
  RefinementList,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  useHits,
  HierarchicalMenu,
  useInstantSearch,
  useRefinementList,
  Stats,
} from 'react-instantsearch';

import { CreateQuickFilters } from './Components/CreateQuickFilters';
import { RefinementSize } from './Components/RefinementSize';

import { Panel } from './Components/Panel';

import type { Hit } from 'instantsearch.js';

import { routing } from './util/Router';


import './App.css';

const searchClient = algoliasearch(
  'SRD7V01PUE',
  '21d2cd80869e20eb0becf4065f058b95'
);



const future = { preserveSharedStateOnUnmount: true };

const indexName = "max_bopis_test"

export function App() {

  let [store, setStore] = useState(['1795']);
  let [storeFilter, setStoreFilter] = useState("");

  useEffect(() => {
    let filtersToSend = []
    for (let s of store) {
      let singleFilter = `storeAggregate:${s}`
      filtersToSend.push(singleFilter)
    }
    setStoreFilter(filtersToSend.join(" OR "))
  }, [store])




  function handleStoreOnClick(event) {
    event.preventDefault()
    if (event?.target?.value) {
      let value = event.target.value;
      setStore(currentArray => {
        // Check if the value is already in the array
        const index = currentArray.indexOf(value);
        if (index !== -1) {
          // Value exists, remove it from the array
          return currentArray.filter(item => item !== value);
        } else {
          // Value does not exist, add it to the array
          return [...currentArray, value];
        }
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
        <InstantSearch searchClient={searchClient} indexName="max_bopis_test" insights future={future} routing={true}>
          <Configure hitsPerPage={8} filters={storeFilter} />
          <div className="search-panel">
            <div className="search-panel__filters">
              <Stats />
              <Panel header="Current Store">
                <label>{store}</label>
              </Panel>
              <Panel header="Store Locator">
                <ul className="ais-RefinementList-list">

                  <li className="ais-RefinementList-item">
                    <label className="ais-RefinementList-label">
                      <input className="ais-RefinementList-checkbox" type="checkbox" value="1001" onClick={handleStoreOnClick} />
                      <span className="ais-RefinementList-labelText">1001</span>
                    </label>
                  </li>
                  <li className="ais-RefinementList-item">
                    <label className="ais-RefinementList-label">
                      <input className="ais-RefinementList-checkbox" type="checkbox" value="1002" onClick={handleStoreOnClick} />
                      <span className="ais-RefinementList-labelText">1002</span>
                    </label>
                  </li>
                  <li className="ais-RefinementList-item">
                    <label className="ais-RefinementList-label">
                      <input className="ais-RefinementList-checkbox" type="checkbox" value="1003" onClick={handleStoreOnClick} />
                      <span className="ais-RefinementList-labelText">1003</span>
                    </label>
                  </li>
                </ul>
              </Panel>
              <DynamicWidgets>
                <Panel header="Categories">
                  <RefinementList
                    attribute='categories'
                    showMore={true}
                  />
                </Panel>
                <Panel header="Brands">
                  <RefinementList attribute="brand" showMore={true} />
                </Panel>
              </DynamicWidgets>
              <Panel header='Sizes'>
                <RefinementSize attribute="sizes" store={store} sortBy={['name:asc']} />
              </Panel>

            </div>

            <div className="search-panel__results">
              <SearchBox placeholder="" className="searchbox" />
              <CreateQuickFilters />
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

type HitProps = {
  hit: Hit;
};

function Hit({ hit }: HitProps) {
  return (
    <article>
      <div>

        <img src={hit.image} alt={hit.name} />
        <h1>
          <Highlight attribute="name" hit={hit} />
        </h1>

        <p>
          <Highlight attribute="brand" hit={hit} />
        </p>
        <p>
          <Highlight attribute="categories" hit={hit} />
        </p>
      </div>
    </article>
  );
}
