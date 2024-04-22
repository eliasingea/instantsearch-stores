export function createSearchClientProxy(searchClient, dynamicValue) {
    let filtersToSend = [];

    for (let store of dynamicValue) {
        let singleFilter = `storeAggregate:${store}`
        filtersToSend.push(singleFilter)

    }

    return {
        ...searchClient,
        search(requests) {
            let request = requests[0]
            let filters = request?.params?.filters;
            let facets = request?.params?.facetFilters;
            let values = []
            // if (facets) {
            //     for (let facet of facets) {
            //         if (facet.some(e => e.includes("size"))) {

            //             for (let facetOptions of facet) {
            //                 let value = facetOptions.split(":")[1]
            //                 values.push(value);
            //             }
            //         }
            //     }
            // }
            if (!filters) {
                filters = filtersToSend.join(" OR ")
            } else {
                filters = filters + " AND " + filtersToSend.join(" OR ")
            }
            request.params.filters = filters;
            return searchClient.search(requests);
        }
    };
}
