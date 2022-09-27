import * as React from "react";

import queryString from "query-string";

const useSearchParams = ({ parseOptions, stringifyOptions } = {}) => {
  const [searchParams, _setSearchParams] = React.useState({});

  const setSearchParams = React.useCallback(
    (params, { replaceState } = { replaceState: false }) => {
      // TODO: Once useEvent is real, this whole block should probably be an
      // event so we're not relying on `stringifyOptions` not changing.
      const url = `${new URL(
        window.location.origin + window.location.pathname
      )}?${queryString.stringify(params, stringifyOptions)}`;
      const historyParams = [{}, "", url];

      replaceState
        ? window.history.replaceState(...historyParams)
        : window.history.pushState(...historyParams);

      _setSearchParams(params);
    },
    [stringifyOptions]
  );

  React.useEffect(() => {
    const callback = () => {
      _setSearchParams(queryString.parse(window.location.search, parseOptions));
    };
    callback();
    return subscribe(callback);
  }, [parseOptions]);

  return [searchParams, setSearchParams];
};

// Allows for proper navigation of history
// https://www.codeguage.com/courses/js/events-popstate-event
const subscribe = (callback) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};

export default useSearchParams;
