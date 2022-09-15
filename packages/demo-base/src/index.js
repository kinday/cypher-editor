/*
 * Copyright (c) 2002-2017 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import neo4j from "neo4j-driver";

export { neo4jSchema, simpleSchema } from "./schema-data";
import { simpleSchema } from "./schema-data";

export const codeMirrorSettings = {
  value: `// line comment
/* block comment */
:play "http://example.com";
:play incommand-dash;
MATCH (variable)
MATCH (:Label)
MATCH ()-[:RelationshipType]-()
WITH $param
WITH {param}
RETURN some.functionNamme()
CALL some.procedureName()
CALL some.procedureName() YIELD param1, param2 as somethingElse
MATCH (variable {propKey: 1})
SET variable.propKey = 1;`,
  mode: "application/x-cypher-query",
  indentWithTabs: true,
  smartIndent: false,
  lineNumbers: true,
  matchBrackets: true,
  autofocus: true,
  theme: "cypher cypher-dark",
  lint: true,
  styleActiveLine: true,
  extraKeys: { "Ctrl-Space": "autocomplete" },
  hintOptions: {
    completeSingle: false,
    closeOnUnfocus: false,
    alignWithWord: true,
    async: true
  },
  gutters: ["cypher-hints"],
  lineWrapping: false,
  autoCloseBrackets: {
    explode: ""
  }
};

export const metaQuery = `	CALL db.labels() YIELD label
	RETURN {name:'labels', data:COLLECT(label)[..1000]} AS result
	UNION ALL
	CALL db.relationshipTypes() YIELD relationshipType
	RETURN {name:'relationshipTypes', data:COLLECT(relationshipType)[..1000]} AS result
	UNION ALL
	CALL db.propertyKeys() YIELD propertyKey
	RETURN {name:'propertyKeys', data:COLLECT(propertyKey)[..1000]} AS result
	UNION ALL
	CALL dbms.functions() YIELD name, signature, description
	RETURN {name:'functions', data: collect({name: name, signature: signature, description: description})} AS result
	UNION ALL
	CALL dbms.procedures() YIELD name, signature, description
	RETURN {name:'procedures', data:collect({name: name, signature: signature, description: description})} AS result
	UNION ALL
	MATCH () RETURN { name:'nodes', data:count(*) } AS result
	UNION ALL
	MATCH ()-[]->() RETURN { name:'relationships', data: count(*)} AS result
`;

export const shortMetaQuery = `  CALL db.labels() YIELD label
  RETURN {name:'labels', data:COLLECT(label)[..1000]} AS result
`;

export const simpleQuery = `MATCH (n) RETURN n LIMIT 10`;

export const serverInfoQuery = `CALL dbms.components() YIELD name, versions, edition`;

export const longQuery = metaQuery;

export const initialPosition = { line: 2, column: 3 };

export const host = "neo4j://localhost:7687";

export const user = "neo4j";

export const pass = "asdfgh";

export const defaultOptions = {
  lineNumbers: true, // whether to show the line numbers next to the editor
  autofocus: true, // if true the editor will be focused once created
  placeholder: undefined, // this text shows when the actual text is empty
  readOnly: false, // can be one of: true / false / "nocursor"
  autocomplete: true, // whether to show autocompletion
  lint: true, // whether to show lint errors,
  autocompleteTriggerStrings: [".", ":", "[]", "()", "{}", "[", "(", "{", "$"],
  autocompleteSticky: false,
  lineWrapping: false
};

export const defaultLineNumberFormatter = undefined;
export const noneLineNumberFormatter = (line) => line;
export const customLineNumberFormatter = (line, lineCount) => {
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

export const samplePlaceholder = "Sample Placeholder";

export const initialSchema = simpleSchema;
export const initialValue = longQuery;
export const initialOptions = defaultOptions;

export const defaultTheme = "light";

export const getTitle = ({ codemirrorVersion, framework, bundler }) =>
  `Cypher Codemirror ${codemirrorVersion} ${framework} ${bundler}`;

const printArgument = (argument) => {
  try {
    if (typeof argument === "object" && argument !== null) {
      const { scrollTop, scrollHeight, scrollExtent } = argument;
      if (
        scrollTop !== undefined &&
        scrollHeight !== undefined &&
        scrollExtent !== undefined
      ) {
        return JSON.stringify({ scrollTop, scrollHeight, scrollExtent });
      }
    }
    return JSON.stringify(argument);
  } catch (e) {
    return "error " + e.message + " " + argument;
  }
};

export const getLogText = (logs) =>
  logs
    .map(
      ({ type, label, argument }) =>
        type + " " + label + " " + printArgument(argument)
    )
    .join("\n");

export const commandLog = (command, argument) => {
  return {
    type: "command",
    label: command,
    command,
    argument
  };
};

export const eventLog = (event, argument) => {
  return {
    type: "event",
    label: event,
    event,
    argument
  };
};

const hasSameKeyValues = (a, b, keys) => {
  if (!a && !b) {
    return true;
  } else if (!a || !b) {
    return false;
  } else {
    for (let key of keys) {
      if (a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }
};

export const getChangedScrollInfo = (oldScrollInfo, newScrollInfo) => {
  if (!oldScrollInfo) {
    return newScrollInfo;
  }
  const yChanged = !hasSameKeyValues(oldScrollInfo, newScrollInfo, [
    "scrollTop",
    "clientHeight",
    "scrollHeight"
  ]);
  const xChanged = !hasSameKeyValues(oldScrollInfo, newScrollInfo, [
    "scrollLeft",
    "clientWidth",
    "scrollWidth"
  ]);
  if (xChanged === yChanged) {
    return newScrollInfo;
  } else {
    const {
      scrollTop,
      clientHeight,
      scrollHeight,
      scrollLeft,
      clientWidth,
      scrollWidth
    } = newScrollInfo;
    if (yChanged) {
      return { scrollTop, clientHeight, scrollHeight };
    } else {
      return { scrollLeft, clientWidth, scrollWidth };
    }
  }
};

export const createDriver = () =>
  neo4j.driver(host, neo4j.auth.basic(user, pass));
