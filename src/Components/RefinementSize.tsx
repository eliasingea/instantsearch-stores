import { useInstantSearch, useRefinementList } from "react-instantsearch";

export function RefinementSize(props) {

    const { results } = useInstantSearch();



    let facets = results._rawResults[0].facets;

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

    let itemsToShow = []
    for (let item of items) {
        if (`stores.${item.value}` in facets) {
            for (let store of props.store) {
                if (store in facets[`stores.${item.value}`]) {
                    itemsToShow.push(item);
                }
            }
        }
    }


    return <>
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
    </>;
}
