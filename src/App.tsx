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
  HierarchicalMenu,
  useInstantSearch,
  useRefinementList,
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


const CreateQuickFilters = () => {
  let { results, indexUiState, setIndexUiState } = useInstantSearch();
  let pills = [];


  let orderedValues = results?.renderingContent?.facetOrdering?.values
  if (!orderedValues) return

  for (let [key, value] of Object.entries(orderedValues)) {
    if ("order" in value) {
      for (let facet of value.order) {
        pills.push({ key: key, value: facet });
      }
    }

  }

  return (
    <div>
      {pills.map((pill) => {
        return (
          <button key={pill.key} onClick={
            () => {
              let object = { [pill.key]: [pill.value] }
              setIndexUiState((prevState) => ({
                ...prevState,
                refinementList: {
                  ...prevState.refinementList,
                  ...object
                }
              }));
            }
          }>
            {pill.value}
          </button>
        )
      })}
    </div>
  )
}

const routing = {
  router: history({
    parseURL({ qsModule, location }) {
      let plpSlug = ""
      let collectionHandle = ""
      let context = ""
      let filters = "";
      if (location?.pathname.includes("plp")) {
        plpSlug = location.pathname.split("/")[2]
      }
      if (location?.pathname.includes("collection")) {
        collectionHandle = location.pathname.split("/")[2]
      }

      if (plpSlug) {
        context = plpSlug;
      } else if (collectionHandle) {
        filters = `categories:${collectionHandle}`
      }
      const { query = '', page, brands = [] } = qsModule.parse(
        location.search.slice(1)
      );

      return {
        query: decodeURIComponent(query),
        page,
        context,
        filters
      }
    },
  }),
  stateMapping: {
    stateToRoute(uiState) {
      // ...
      const indexUiState = uiState[indexName];
      return {
        q: indexUiState.query,
        brand: indexUiState.refinementList?.brand,
        page: indexUiState.page,
        categories: indexUiState.refinementList?.categories

      }
    },
    routeToState(routeState) {
      ;
      // ...
      return {
        [indexName]: {
          query: routeState.q,
          configure: {
            ruleContexts: routeState.context,
            filters: routeState.filters,
          },
          RefinementList: {
            brand: routeState.brand,
            categories: routeState.categories
          },
          page: routeState.page
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
              <DynamicWidgets>
                <Panel header="Categories">
                  <RefinementList
                    attribute='categories'
                  />
                </Panel>
                <Panel header="Brands">
                  <RefinementList attribute="brand" />
                </Panel>
              </DynamicWidgets>
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
