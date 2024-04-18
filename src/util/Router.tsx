import { history } from 'instantsearch.js/es/lib/routers';
const indexName = "max_bopis_test"

export const routing = {
    routing: history(),
    stateMapping: {
        stateToRoute(uiState) {
            // ...
            const indexUiState = uiState[indexName];
            return {
                q: indexUiState.query,
                brand: indexUiState.refinementList?.brand,
                page: indexUiState.page,
                categories: indexUiState.refinementList?.categories,
                sizes: indexUiState.refinementList?.sizes,
            }
        },
        routeToState(routeState) {
            console.log(routeState)
            return {
                [indexName]: {
                    query: routeState.q,
                    configure: {
                        ruleContexts: routeState.context,
                        filters: routeState.filters,
                    },
                    refinementList: {
                        brand: routeState.brand,
                        categories: routeState.categories,
                        sizes: routeState.sizes,
                    },
                    page: routeState.page,
                }
            }
        },
    },
};