import { useInstantSearch } from "react-instantsearch";

export const CreateQuickFilters = () => {
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