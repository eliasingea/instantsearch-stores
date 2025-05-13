import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  DynamicWidgets,
  useDynamicWidgets,
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
import { history } from 'instantsearch.js/es/lib/routers';
import { Hit } from './Hit';
import { CreateQuickFilters } from './CreateQuickFilters';
import { RefinementSize } from './RefinementSize';

import { Panel } from './Panel';
import { FilterProvider, useFilters } from '../util/FilterContext';
import React from 'react';

const searchClient = algoliasearch(
  'SRD7V01PUE',
  '21d2cd80869e20eb0becf4065f058b95'
);



const future = { preserveSharedStateOnUnmount: true };

const indexName = "max_bopis_test"


export function SearchWrapper({ store, onStoreClick }) {
    const { storeFilter } = useFilters(); 
  
    return (
      <InstantSearch
        searchClient={searchClient}
        indexName="max_bopis_test"
        insights={false}
        future={future}
        routing={true}
      >
        <Configure hitsPerPage={8} filters={storeFilter} />
        <div className="search-panel">
          <div className="search-panel__filters">
            <Stats />
            <Panel header="Current Store">
              <label>{store.join(', ')}</label>
            </Panel>
            <Panel header="Store Locator">
              <ul className="ais-RefinementList-list">
                {['1948', '1002', '1003'].map(id => (
                  <li className="ais-RefinementList-item" key={id}>
                    <label className="ais-RefinementList-label">
                      <input
                        className="ais-RefinementList-checkbox"
                        type="checkbox"
                        value={id}
                        onClick={onStoreClick}
                      />
                      <span className="ais-RefinementList-labelText">{id}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </Panel>
  
            <Panel header="Sizes">
              <RefinementSize attribute="sizes" store={store} sortBy={['name:asc']} />
            </Panel>
  
            <DynamicWidgets>
              <Panel header="Categories">
                <RefinementList attribute="categories" showMore />
              </Panel>
              <Panel header="Brands">
                <RefinementList attribute="brand" showMore />
              </Panel>
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
    );
  }
  