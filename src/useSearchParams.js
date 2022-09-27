import * as React from "react";

import queryString from "query-string";

const useSearchParams = ({ parseOptions, stringifyOptions } = {}) => {
  // TODO: useReducer in order to get the current `parseOptions` value,
  // once we have useEvent, this can be a useState with useEvent most likely
  const reducer = (_, action) => {
    switch (action.type) {
      case "parseAndUpdate": {
        return queryString.parse(action.value, parseOptions);
      }
      case "update": {
        return action.value;
      }
      default: {
        throw new Error("Unrecognized action");
      }
    }
  };
  const [searchParams, dispatch] = React.useReducer(reducer, {});
  const locationSearchRef = React.useRef(window.location.search);

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

      dispatch({ type: "update", value: params });
    },
    [stringifyOptions]
  );

  // Allows for proper navigation of history
  // https://www.codeguage.com/courses/js/events-popstate-event
  const subscribe = (_callback) => {
    const callback = (event) => {
      locationSearchRef.current = window.location.search;
      _callback(event);
    };

    window.addEventListener("popstate", callback);
    return () => window.removeEventListener("popstate", callback);
  };

  const locationSearch = React.useSyncExternalStore(
    subscribe,
    () => locationSearchRef.current
  );

  React.useEffect(() => {
    dispatch({ type: "parseAndUpdate", value: locationSearch });
  }, [locationSearch]);

  return [searchParams, setSearchParams];
};

export default useSearchParams;
