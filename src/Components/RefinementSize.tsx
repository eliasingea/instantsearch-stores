import { useInstantSearch, useRefinementList } from "react-instantsearch";
import React, { useEffect, useState } from "react";


export function RefinementSize(props) {

    const { results } = useInstantSearch();
    let facets = results._rawResults[0].facets;

    const {
        items,
        refine,
    } = useRefinementList(props);

    const itemsToShow = items.filter(item =>
        `stores.${item.value}` in facets &&
        props.store.some(store => store in facets[`stores.${item.value}`])
    );

    return (
        <article>
            <ul className="ais-RefinementList-list">
                {itemsToShow.map((item) => (
                    <li className="ais-RefinementList-item" key={item.label}>
                        <label className="ais-RefinementList-label">
                            <input className="ais-RefinementList-checkbox"
                                type="checkbox"
                                checked={item.isRefined}
                                onChange={() => refine(item.value)}
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
