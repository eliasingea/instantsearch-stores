import { useInstantSearch, useRefinementList } from "react-instantsearch";
import React, { useEffect, useState } from "react";


export function RefinementSize(props) {

    const { results, setIndexUiState, indexUiState } = useInstantSearch();
    let facets = results._rawResults[0].facets;


    const [sizes, setSizes] = useState([]);

    const {
        items,
        hasExhaustiveItems,
        createURL,
        refine,
        sendEvent,
        searchForItems,
        isFromSearch,
        canRefine,
        canToggleShowMore,
        isShowingMore,
        toggleShowMore,
    } = useRefinementList(props);

    let itemsSet = new Set()
    for (let item of items) {
        if (`stores.${item.value}` in facets) {
            for (let store of props.store) {
                if (store in facets[`stores.${item.value}`]) {
                    itemsSet.add(item);
                }
            }
        }
    }

    let itemsToShow = [...itemsSet]

    useEffect(() => {
        let filtersToSend = [];
        for (let size of sizes) {
            for (let store of props.store) {
                filtersToSend.push(`stores.${size}:${store}`)
            }
        }
        setIndexUiState((prevState) => ({
            ...prevState,
            configure: {
                filters: filtersToSend.join(" OR ")
            }
        }));

    }, [sizes])


    const handleSizeClick = (itemValue) => {
        setSizes(currentArray => {
            // Check if the value is already in the array
            const index = currentArray.indexOf(itemValue);
            if (index !== -1) {
                // Value exists, remove it from the array

                return currentArray.filter(item => item !== itemValue);
            } else {
                // Value does not exist, add it to the array
                return [itemValue, ...currentArray];
            }

        });
        refine(itemValue);
    }

    return (
        <article>
            <ul className="ais-RefinementList-list">
                {itemsToShow.map((item) => (
                    <li className="ais-RefinementList-item" key={item.label}>
                        <label className="ais-RefinementList-label">
                            <input className="ais-RefinementList-checkbox"
                                type="checkbox"
                                checked={item.isRefined}
                                onChange={() => handleSizeClick(item.value)}
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
