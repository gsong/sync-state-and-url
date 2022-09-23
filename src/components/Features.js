import styles from "../App.module.scss";

const Features = ({ replaceState, setReplaceState }) => (
  <details>
    <summary>Features</summary>
    <ul className={styles.featureList}>
      <li>
        <code>useSearchParams</code> is the hook of interest. It exposes{" "}
        <code>[searchParams, setSearchParams]</code>
      </li>
      <li>
        Deserialize <code>window.location.search</code> (if any) using{" "}
        <a href="https://github.com/sindresorhus/query-string#parsestring-options">
          <code>query-string.parse</code>
        </a>{" "}
        on initial load and browser navigation to <code>searchParams</code>
      </li>
      <li>
        On <code>setSearchParams</code>, serialze <code>searchParams</code> to{" "}
        <code>window.location.search</code> using{" "}
        <a href="https://github.com/sindresorhus/query-string#stringifyobject-options">
          <code>query-string.stringify</code>
        </a>
      </li>
      <li>
        <fieldset>
          <legend>
            Decide if <code>setSearchParams</code> should:
          </legend>

          <div>
            <label>
              <input
                type="radio"
                name="replaceState"
                checked={!replaceState}
                onChange={() => setReplaceState(false)}
              />
              Add an entry to the browser's session history stack
            </label>
          </div>

          <div>
            <label>
              <input
                type="radio"
                name="replaceState"
                checked={replaceState}
                onChange={() => setReplaceState(true)}
              />
              Replace the current entry in the browser's session history stack
            </label>
          </div>
        </fieldset>
      </li>
    </ul>
  </details>
);

export default Features;
