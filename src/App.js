import * as React from "react";

import queryString from "query-string";

import useSearchParams from "./useSearchParams.js";
import Features from './components/Features.js'

import styles from "./App.module.scss";

export default function App() {
  const { searchParams, onSubmit, replaceState, setReplaceState } = useInit();
  const { hits, showResults } = useSearch(searchParams);

  return (
    <>
      <main>
        <h1>
          Sync <code>window.location.search</code> to Component State
        </h1>
        <Features {...{ replaceState, setReplaceState }} />

        <hr />
        <h2>Search Hacker News</h2>
        <form
          method="get"
          {...{ onSubmit }}
          key={JSON.stringify(searchParams)}
          className={styles.form}
        >
          <label>
            Query:{" "}
            <input
              name={PARAMS.query}
              defaultValue={searchParams[PARAMS.query]}
              required
            />
          </label>
          <label>
            <input
              type="checkbox"
              name={PARAMS.tags}
              value="front_page"
              defaultChecked={searchParams[PARAMS.tags]}
            />{" "}
            Front page
          </label>
          <label>
            <input
              type="checkbox"
              name={PARAMS.sortByRecent}
              defaultChecked={searchParams[PARAMS.sortByRecent]}
            />{" "}
            Sort by recent?
          </label>
          <button>Submit</button>
        </form>

        {showResults && (
          <>
            <hr />
            <output>
              {hits.length > 0 ? (
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
              )}
            </output>
          </>
        )}
      </main>

      <aside>
        <hr />
        <h2>Current Context</h2>
        <output>
          <pre>{JSON.stringify({ searchParams, hits }, null, 2)}</pre>
        </output>
      </aside>
    </>
  );
}

const PARAMS = { query: "query", sortByRecent: "sortByRecent", tags: "tags" };

const useInit = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [replaceState, setReplaceState] = React.useState(false);

  const onSubmit = (event) => {
    const { currentTarget: form } = event;
    event.preventDefault();
    setSearchParams(Object.fromEntries(new FormData(form).entries()), {
      replaceState,
    });
  };

  return { searchParams, onSubmit, replaceState, setReplaceState };
};

const useSearch = (_searchParams) => {
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

  const showResults = React.useMemo(
    () => Object.keys(searchParams).length > 0,
    [searchParams]
  );

  React.useEffect(() => {
    const controller = new AbortController();

    if (showResults) {
      const searchPath =
        _searchParams[PARAMS.sortByRecent] === "on"
          ? "search_by_date"
          : "search";
      const tags = searchParams[PARAMS.tags];
      const params = queryString.stringify(
        { ...searchParams, [PARAMS.tags]: tags ? [tags, "story"] : "story" },
        { arrayFormat: "comma" }
      );
      const url = `https://hn.algolia.com/api/v1/${searchPath}?${params}`;

      (async () => {
        const { hits } = await (
          await fetch(url, { signal: controller.signal })
        ).json();
        setHits(hits);
      })();
    } else {
      setHits([]);
    }

    return () => controller.abort();
  }, [_searchParams, searchParams, showResults]);

  return { hits, showResults };
};
