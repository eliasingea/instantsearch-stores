import { history } from 'instantsearch.js/es/lib/routers';
const indexName = "max_bopis_test"

export const routing = {
    router: history({
        parseURL({ qsModule, location }) {
            let plpSlug = ""
            let collectionHandle = ""
            let context = ""
            let filters = "";
            if (location?.pathname.includes("plp")) {
                plpSlug = location.pathname.split("/")[2]
            }
            if (location?.pathname.includes("collection")) {
                collectionHandle = location.pathname.split("/")[2]
            }

            if (plpSlug) {
                context = plpSlug;
            } else if (collectionHandle) {
                filters = `categories:${collectionHandle}`
            }
            const { query = '', page, brands = [] } = qsModule.parse(
                location.search.slice(1)
            );

            return {
                query: decodeURIComponent(query),
                page,
                context,
                filters
            }
        },
    }),
    stateMapping: {
        stateToRoute(uiState) {
            // ...
            const indexUiState = uiState[indexName];
            return {
                q: indexUiState.query,
                brand: indexUiState.refinementList?.brand,
                page: indexUiState.page,
                categories: indexUiState.refinementList?.categories,
                size: indexUiState.size,
            }
        },
        routeToState(routeState) {
            ;
            // ...
            return {
                [indexName]: {
                    query: routeState.q,
                    configure: {
                        ruleContexts: routeState.context,
                        filters: routeState.filters,
                    },
                    RefinementList: {
                        brand: routeState.brand,
                        categories: routeState.categories
                    },
                    page: routeState.page,
                    size: routeState.size
                }
            }
        },
    },
};