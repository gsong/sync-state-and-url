import * as React from "react";

import queryString from "query-string";

import Features from "./components/Features.js";
import SearchForm from "./components/SearchForm.js";
import useSearchParams from "./useSearchParams.js";
import { PARAMS } from "./constants.js";

import styles from "./App.module.scss";

export default function App() {
  const { searchParams, onSubmit, replaceState, setReplaceState } = useInit();
  const { status, hits, showResults } = useSearch(searchParams);

  return (
    <>
      <main>
        <h1>
          Sync <code>window.location.search</code> to Component State
        </h1>
        <Features {...{ replaceState, setReplaceState }} />

        <hr />
        <h2>Search Hacker News</h2>
        <SearchForm {...{ searchParams, onSubmit }} />

        {showResults && (
          <>
            <hr />
            <output>
              {status === "done" ? (
                hits.length > 0 ? (
                  <ol className={styles.hits}>
                    {hits.map((hit) => (
                      <li key={hit.objectID}>
                        <a href={hit.url}>
                          {hit.title} (
                          {new Date(hit.created_at).toLocaleDateString()})
                        </a>
                      </li>
                    ))}
                  </ol>
                ) : (
                  "No results"
                )
              ) : (
                "Searching…"
              )}
            </output>
          </>
        )}
      </main>

      <aside>
        <hr />
        <h2>Current Context</h2>
        <output>
          <pre>{JSON.stringify({ status, searchParams, hits }, null, 2)}</pre>
        </output>
      </aside>
    </>
  );
}

const useInit = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [replaceState, setReplaceState] = React.useState(false);

  const onSubmit = React.useCallback(
    (event) => {
      const { currentTarget: form } = event;
      event.preventDefault();
      setSearchParams(Object.fromEntries(new FormData(form).entries()), {
        replaceState,
      });
    },
    [replaceState, setSearchParams]
  );

  return {
    searchParams,
    onSubmit,
    replaceState,
    setReplaceState,
  };
};

const useSearch = (_searchParams) => {
  const [status, setStatus] = React.useState();
  const [hits, setHits] = React.useState([]);

  const searchParams = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(_searchParams).filter(
          ([k]) => Object.keys(PARAMS).includes(k) && k !== PARAMS.sortByRecent
        )
      ),
    [_searchParams]
  );

  const showResults = Object.keys(searchParams).length > 0;
  const searchPath =
    _searchParams[PARAMS.sortByRecent] === "on" ? "search_by_date" : "search";

  React.useEffect(() => {
    const setResults = (hits) => {
      setStatus("done");
      setHits(hits);
    };

    const controller = new AbortController();

    setStatus("searching");

    if (showResults) {
      const tags = searchParams[PARAMS.tags];
      const params = queryString.stringify(
        { ...searchParams, [PARAMS.tags]: tags ? [tags, "story"] : "story" },
        { arrayFormat: "comma" }
      );
      const url = `https://hn.algolia.com/api/v1/${searchPath}?${params}`;

      (async () => {
        try {
          const { hits } = await (
            await fetch(url, { signal: controller.signal })
          ).json();
          setResults(hits);
        } catch (error) {
          console.error("Error: ", error);
        }
      })();
    } else {
      setResults([]);
    }

    return () => controller.abort();
  }, [searchParams, showResults, searchPath]);

  return { status, hits, showResults };
};
