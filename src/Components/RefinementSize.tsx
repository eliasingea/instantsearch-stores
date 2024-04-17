import { useInstantSearch } from "react-instantsearch";

export function RefinementSize() {
    const { results, indexUiState, setIndexUiState } = useInstantSearch();
    let sizes = [];
    let facets = results?._rawResults[0]?.facets;
    if (!facets) return
    for (let facet of Object.keys(facets)) {
        if (facet.includes("stores.")) {
            sizes.push(facet.split(".")[1])
        }
    }
    if (!sizes) return <></>
    console.log(indexUiState)
    return (
        <ul className="ais-RefinementList-list" >
            {sizes.map((size) => {
                return (
                    <li className="ais-RefinementList-item" key={size} onClick={
                        () => {
                            setIndexUiState((prevState) => ({
                                ...prevState,
                                size: size
                            }));
                        }
                    }>
                        <label className="ais-RefinementList-label">
                            <input className="ais-RefinementList-checkbox" type="checkbox" value={size} />
                            <span className="ais-RefinementList-labelText">{size}</span>
                        </label>
                    </li>
                )
            })}
        </ul>
    )
}
