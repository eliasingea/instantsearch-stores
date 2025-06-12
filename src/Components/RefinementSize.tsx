import { useRefinementList, useInstantSearch } from 'react-instantsearch';
import React, { useEffect, useState } from 'react';
import { useFilters } from '../util/FilterContext'; 

export function RefinementSize(props) {
  const { results, setIndexUiState } = useInstantSearch();
  const { updateFilters } = useFilters(); // <<-- use context

  const [sizes, setSizes] = useState([]);
  const { items, refine } = useRefinementList(props);

  let facets = results?._rawResults?.[0]?.facets || {};
  let itemsSet = new Set();

  for (let item of items) {
    if (`stores.${item.value}` in facets) {
      for (let store of props.store) {
        if (store in facets[`stores.${item.value}`]) {
          itemsSet.add(item);
        }
      }
    }
  }

  let itemsToShow = [...itemsSet];

  useEffect(() => {
   
    // Avoid setting state if sizes and props.store are empty
    if (!sizes.length) {
      setIndexUiState(prev => {
        if (prev.refinementList?.sizes?.length === 0) return prev; // no change
        return {
          ...prev,
          refinementList: {
            ...prev.refinementList,
            sizes: [],
          },
        };
      });
  
      updateFilters([]); // Reset Configure filter only if it was set before
      return;
    }
  
    const filtersToSend = [];
    for (let size of sizes) {
      for (let store of props.store) {
        filtersToSend.push(`stores.${size}:${store}`);
      }
    }
  
    setIndexUiState(prev => {
      const currentSizes = prev.refinementList?.sizes || [];
      const sameSizes = currentSizes.length === sizes.length && currentSizes.every(val => sizes.includes(val));
      if (sameSizes) return prev; // avoid triggering a request with no change
  
      return {
        ...prev,
        refinementList: {
          ...prev.refinementList,
          sizes: [...sizes],
        },
      };
    });
  
    updateFilters(filtersToSend);
  }, [sizes, props.store]);
  

  const handleSizeClick = (refine, item) => {
    let itemValue = item.value;
    setSizes(current => {
      const index = current.indexOf(itemValue);
      if (index !== -1) {
        item.isRefined = false;
        return current.filter(val => val !== itemValue);
      } else {
        return [itemValue, ...current];
      }
    });
  };

  return (
    <article>
      <ul className="ais-RefinementList-list">
        {itemsToShow.map(item => (
          <li className="ais-RefinementList-item" key={item.label}>
            <label className="ais-RefinementList-label">
              <input
                className="ais-RefinementList-checkbox"
                type="checkbox"
                checked={item.isRefined}
                onChange={() => handleSizeClick(refine, item)}
                value={item.value}
              />
              <span className="ais-RefinementList-labelText">{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </article>
  );
}
