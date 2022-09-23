import * as React from "react";

import queryString from "query-string";

const useSearchParams = (parseOptions, stringifyOptions) => {
  const [searchParams, _setSearchParams] = React.useState({});

  const setSearchParams = React.useCallback(
    (params, { replaceState } = { replaceState: false }) => {
      const url = `${new URL(
        window.location.origin + window.location.pathname
      )}?${queryString.stringify(params, stringifyOptions)}`;
      const historyParams = [{}, "", url];

      replaceState
        ? window.history.replaceState(...historyParams)
        : window.history.pushState(...historyParams);

      _setSearchParams(params);
    },
    [_setSearchParams, stringifyOptions]
  );

  const locationSearch = React.useSyncExternalStore(
    subscribe,
    () => window.location.search
  );

  React.useEffect(() => {
    _setSearchParams(queryString.parse(locationSearch, parseOptions));
  }, [locationSearch, parseOptions]);

  return [searchParams, setSearchParams];
};

// Allows for proper navigation of history
// https://www.codeguage.com/courses/js/events-popstate-event
const subscribe = (callback) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};

export default useSearchParams;
