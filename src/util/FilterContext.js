import React, { createContext, useContext, useState, useEffect } from 'react';

const FilterContext = createContext();

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ store, children }) => {
  const [baseFilter, setBaseFilter] = useState('');
  const [dynamicFilter, setDynamicFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');

  // Set the initial baseFilter on mount or when store changes
  useEffect(() => {
    const filters = store.map(s => `storeAggregate:${s}`);
    const filterStr = filters.join(' OR ');
    setBaseFilter(filterStr);
  }, [store]);

  // Whenever baseFilter or dynamicFilter change, update storeFilter
  useEffect(() => {
    let combined = baseFilter;
    if (dynamicFilter) {
      combined += ` AND (${dynamicFilter})`;
    }
    setStoreFilter(combined);
  }, [baseFilter, dynamicFilter]);

  const updateFilters = (filtersToSend) => {
    const newDynamic = filtersToSend.length ? filtersToSend.join(' OR ') : '';
    setDynamicFilter(newDynamic);
  };

  return (
    <FilterContext.Provider value={{ storeFilter, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
