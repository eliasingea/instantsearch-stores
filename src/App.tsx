import React from 'react';
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
} from 'react-instantsearch';
import { history } from 'instantsearch.js/es/lib/routers';


import { Panel } from './Panel';

import type { Hit } from 'instantsearch.js';

import './App.css';

const searchClient = algoliasearch(
  'SRD7V01PUE',
  '21d2cd80869e20eb0becf4065f058b95'
);

const future = { preserveSharedStateOnUnmount: true };

const indexName = "max_bopis_test"



const routing = {
  router: history({
    parseURL({ qsModule, location }) {
      console.log(location.pathname);
      let plpSlug = ""
      let context = ""
      if (location?.pathname.includes("plp")) {
        plpSlug = location.pathname.split("/")[2]
      }
      if (plpSlug) {
        context = plpSlug;
      }
      const { query = '', page, brands = [] } = qsModule.parse(
        location.search.slice(1)
      );

      return {
        query: decodeURIComponent(query),
        page,
        context
      }
    },
  }),
  stateMapping: {
    stateToRoute(uiState) {
      // ...
      const indexUiState = uiState[indexName];
      return {
        q: indexUiState.query,

      }
    },
    routeToState(routeState) {
      console.log(routeState);
      // ...
      return {
        [indexName]: {
          query: routeState.q,
          configure: {
            ruleContexts: routeState.context,
          }
        }
      }
    },
  },
};

export function App() {
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
        <InstantSearch searchClient={searchClient} indexName="max_bopis_test" future={future} insights routing={routing}>
          <Configure hitsPerPage={8} />
          <div className="search-panel">
            <div className="search-panel__filters">
              <DynamicWidgets fallbackComponent={RefinementList}>
              </DynamicWidgets>
            </div>

            <div className="search-panel__results">
              <SearchBox placeholder="" className="searchbox" />
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
