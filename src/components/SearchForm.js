import styles from "../App.module.scss";

const SearchForm = () => (
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
);

export default SearchForm;
