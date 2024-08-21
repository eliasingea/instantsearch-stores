import type { Hit } from 'instantsearch.js';
import {
    Highlight,
} from "react-instantsearch"
import React from 'react';
type HitProps = {
    hit: Hit;
};

export function Hit({ hit }: HitProps) {
    return (
        <article>
            <div>

                <img src={hit.image} alt={hit.name} />
                <h1>
                    <Highlight attribute="name" hit={hit} />
                </h1>

                <p>
                    <Highlight attribute="brand" hit={hit} />
                </p>
                <p>
                    <Highlight attribute="categories" hit={hit} />
                </p>
            </div>
        </article>
    );
}
