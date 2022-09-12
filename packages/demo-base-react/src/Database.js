import React, { useState } from "react";
import neo4j from "neo4j-driver";
import {
  neo4jSchema,
  simpleSchema,
  defaultQuery,
  defaultOptions,
  initialPosition,
  host,
  user,
  pass
} from "demo-base";

const initialSchema = simpleSchema;
const initialValue = defaultQuery;
const initialOptions = defaultOptions;

const driver = neo4j.driver(host, neo4j.auth.basic(user, pass));

const Database = ({ CypherEditor, codemirrorVersion, framework, bundler }) => {
  const title = `Cypher Codemirror ${codemirrorVersion} ${framework} ${bundler}`;
  const defaultLineNumberFormatter = undefined;
  const noneLineNumberFormatter = (line) => line;
  const customLineNumberFormatter = (line, lineCount) => {
    if (line === 1) {
      return "one";
    } else if (line === 2) {
      return "two";
    } else if (line === 3) {
      return "three";
    } else if (line > 3) {
      return line + " / " + lineCount + " prompt$";
    }
  };
  const [cypher, setCypher] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [theme, setTheme] = useState("light");
  const [position, setPosition] = useState(initialPosition);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [focused, setFocused] = useState(true);
  const [editor, setEditor] = useState(null);
  const [lineNumbers, setLineNumbers] = useState(
    initialOptions.lineNumbers || true
  );
  const [lineNumberFormatter, setLineNumberFormatter] = useState(
    initialOptions.lineNumberFormatter
  );
  const [schema, setSchema] = useState(initialSchema);
  const [readOnly, setReadOnly] = useState(initialOptions.readOnly || false);
  const [autocomplete, setAutocomplete] = useState(
    initialOptions.autocomplete || true
  );
  const [autocompleteTriggerStrings, setAutocompleteTriggerStrings] = useState(
    initialOptions.autocompleteTriggerStrings || undefined
  );
  const [autocompleteSticky, setAutocompleteSticky] = useState(
    initialOptions.autocompleteSticky
  );
  const [lint, setLint] = useState(initialOptions.lint || true);

  const send = () => {
    const session = driver.session();
    setLoading(true);
    session.run(cypher).then(
      (results) => {
        setResults(results);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setResults(null);
        setLoading(false);
        setError(error);
      }
    );
  };

  const onValueChange = (value, change) => {
    setCypher(value);
  };

  const onPositionChange = (positionObject) => {
    setPosition(positionObject);
  };

  const onAutocompleteOpenChange = (autocompleteOpen) => {
    setAutocompleteOpen(autocompleteOpen);
  };

  const onFocusChange = (focused) => {
    setFocused(focused);
  };

  const onEditorCreate = (editor) => {
    setEditor(editor);
    setPosition(editor.getPosition());
  };

  const lightTheme = () => {
    setTheme("light");
  };

  const darkTheme = () => {
    setTheme("dark");
  };

  const cypherLength = cypher.length;
  const positionString = position ? JSON.stringify(position) : "";
  const focusedString = focused + "";
  const autocompleteString = autocompleteOpen + "";

  const showLineNumbers = () => {
    setLineNumbers(true);
    editor && editor.setLineNumbers(true);
  };

  const hideLineNumbers = () => {
    setLineNumbers(false);
    editor && editor.setLineNumbers(false);
  };

  const makeReadable = () => {
    setReadOnly(false);
    editor && editor.setReadOnly(false);
  };

  const makeReadOnly = () => {
    setReadOnly(true);
    editor && editor.setReadOnly(true);
  };

  const makeReadOnlyNoCursor = () => {
    setReadOnly("nocursor");
    editor && editor.setReadOnly("nocursor");
  };

  const enableAutocomplete = () => {
    setAutocomplete(true);
    editor && editor.setAutocomplete(true);
  };

  const disableAutocomplete = () => {
    setAutocomplete(false);
    editor && editor.setAutocomplete(false);
  };

  const enableLint = () => {
    setLint(true);
    editor && editor.setLint(true);
  };

  const disableLint = () => {
    setLint(false);
    editor && editor.setLint(false);
  };

  const focusEditor = () => {
    editor && editor.focus();
  };

  const showDefaultLineNumberFormatter = () => {
    setLineNumberFormatter(defaultLineNumberFormatter);
    editor && editor.setLineNumberFormatter(defaultLineNumberFormatter);
  };

  const showNoneLineNumberFormatter = () => {
    setLineNumberFormatter(noneLineNumberFormatter);
    editor && editor.setLineNumberFormatter(noneLineNumberFormatter);
  };

  const showCustomLineNumberFormatter = () => {
    setLineNumberFormatter(customLineNumberFormatter);
    editor && editor.setLineNumberFormatter(customLineNumberFormatter);
  };

  const showSimpleSchema = () => {
    setSchema(simpleSchema);
    editor && editor.setSchema(simpleSchema);
  };

  const showLongSchema = () => {
    setSchema(neo4jSchema);
    editor && editor.setSchema(neo4jSchema);
  };

  const showDefaultAutocompleteTriggerStrings = () => {
    setAutocompleteTriggerStrings(initialOptions.autocompleteTriggerStrings);
    editor &&
      editor.setAutocompleteTriggerStrings(
        initialOptions.autocompleteTriggerStrings
      );
  };

  const showNoAutocompleteTriggerStrings = () => {
    setAutocompleteTriggerStrings(false);
    editor && editor.setAutocompleteTriggerStrings(false);
  };

  const showStickyAutocomplete = () => {
    setAutocompleteSticky(true);
    editor && editor.setAutocompleteSticky(true);
  };

  const showUnstickyAutocomplete = () => {
    setAutocompleteSticky(false);
    editor && editor.setAutocompleteSticky(false);
  };

  let content = "";
  if (loading) {
    content = <p>...waiting</p>;
  } else if (error) {
    content = <p style={{ color: "red" }}>{error.message}</p>;
  } else if (results) {
    content = results.records.map((record, i) => (
      <pre key={i}>{JSON.stringify(record)}</pre>
    ));
  }

  return (
    <div className="database">
      <div className="left">
        <div className="setting">
          <div className="setting-label">Theme</div>
          <div className="setting-values">
            <button
              className={theme === "light" ? "setting-active" : undefined}
              onClick={lightTheme}
            >
              Light
            </button>
            <button
              className={theme === "dark" ? "setting-active" : undefined}
              onClick={darkTheme}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">Line Numbers</div>
          <div className="setting-values">
            <button
              className={lineNumbers === true ? "setting-active" : undefined}
              onClick={showLineNumbers}
            >
              True
            </button>
            <button
              className={lineNumbers === false ? "setting-active" : undefined}
              onClick={hideLineNumbers}
            >
              False
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">Line Number Formatter</div>
          <div className="setting-values">
            <button
              className={
                lineNumberFormatter === defaultLineNumberFormatter
                  ? "setting-active"
                  : undefined
              }
              onClick={showDefaultLineNumberFormatter}
            >
              Default
            </button>
            <button
              className={
                lineNumberFormatter === noneLineNumberFormatter
                  ? "setting-active"
                  : undefined
              }
              onClick={showNoneLineNumberFormatter}
            >
              None
            </button>
            <button
              className={
                lineNumberFormatter === customLineNumberFormatter
                  ? "setting-active"
                  : undefined
              }
              onClick={showCustomLineNumberFormatter}
            >
              Custom
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">Read Only</div>
          <div className="setting-values">
            <button
              className={readOnly === false ? "setting-active" : undefined}
              onClick={makeReadable}
            >
              False
            </button>
            <button
              className={readOnly === true ? "setting-active" : undefined}
              onClick={makeReadOnly}
            >
              True
            </button>
            <button
              className={readOnly === "nocursor" ? "setting-active" : undefined}
              onClick={makeReadOnlyNoCursor}
            >
              No Cursor
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">Autocomplete</div>
          <div className="setting-values">
            <button
              className={autocomplete === true ? "setting-active" : undefined}
              onClick={enableAutocomplete}
            >
              True
            </button>
            <button
              className={autocomplete === false ? "setting-active" : undefined}
              onClick={disableAutocomplete}
            >
              False
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">Autocomplete Triggers</div>
          <div className="setting-values">
            <button
              className={
                autocompleteTriggerStrings ===
                initialOptions.autocompleteTriggerStrings
                  ? "setting-active"
                  : undefined
              }
              onClick={showDefaultAutocompleteTriggerStrings}
            >
              Default
            </button>
            <button
              className={
                autocompleteTriggerStrings === false
                  ? "setting-active"
                  : undefined
              }
              onClick={showNoAutocompleteTriggerStrings}
            >
              False
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">Autocomplete Sticky</div>
          <div className="setting-values">
            <button
              className={
                autocompleteSticky === true
                  ? "setting-active"
                  : undefined
              }
              onClick={showStickyAutocomplete}
            >
              True
            </button>
            <button
              className={
                autocompleteSticky === false || autocompleteSticky === undefined
                  ? "setting-active"
                  : undefined
              }
              onClick={showUnstickyAutocomplete}
            >
              False
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">Schema</div>
          <div className="setting-values">
            <button
              className={schema === simpleSchema ? "setting-active" : undefined}
              onClick={showSimpleSchema}
            >
              Simple
            </button>
            <button
              className={schema === neo4jSchema ? "setting-active" : undefined}
              onClick={showLongSchema}
            >
              Long
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">Lint</div>
          <div className="setting-values">
            <button
              className={lint === true ? "setting-active" : undefined}
              onClick={enableLint}
            >
              True
            </button>
            <button
              className={lint === false ? "setting-active" : undefined}
              onClick={disableLint}
            >
              False
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">Focus</div>
          <div className="setting-values">
            <button onClick={focusEditor}>Focus Editor</button>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="card">
          <h1>{title}</h1>
        </div>
        <div className="card">
          <CypherEditor
            onValueChange={onValueChange}
            onPositionChange={onPositionChange}
            onFocusChange={onFocusChange}
            onAutocompleteOpenChange={onAutocompleteOpenChange}
            onEditorCreate={onEditorCreate}
            initialPosition={initialPosition}
            initialSchema={initialSchema}
            initialValue={initialValue}
            initialOptions={initialOptions}
            theme={theme}
            classNames={["editor"]}
          />
        </div>
        <div className="card">
          <div className="info">
            <div className="info-item-long">Position: {positionString}</div>
            <div className="info-item">Length: {cypherLength}</div>
            <div className="info-item">Focused: {focusedString}</div>
            <div className="info-item">Autocompleting: {autocompleteString}</div>
          </div>
        </div>
        <div className="card">
          <div className="results">
            <button onClick={send}> Run </button>
            <h3>Results</h3>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Database;