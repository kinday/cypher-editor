import type { Editor, EditorChange } from "codemirror";

import type {
  EditorSupportSchema,
  CypherEditorSupport
} from "cypher-editor-support";

export type PositionObject = {
  line: number;
  column: number;
  position: number;
};

export type PartialPositionObject = {
  line: number;
  column: number;
};

export type PositionAny = PositionObject | PartialPositionObject | number;

export type Theme = "light" | "dark";

export type AutofocusProp = "position" | "readOnly" | "value";

export interface AutocompleteOption {
  label: string;
  detail?: string;
  type?: string;
}

export interface ScrollInfo {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
  scrollLeft: number;
  clientWidth: number;
  scrollWidth: number;
}

export type AutocompleteChangedListener = (
  open: boolean,
  from?: number,
  options?: AutocompleteOption[]
) => void;
export type PositionChangedListener = (position: PositionObject) => void;
export type FocusChangedListener = (focused: boolean) => void;
export type ScrollChangedListener = (scrollInfo: ScrollInfo) => void;
/**
 * This listener is fired when the value of the cypher editor is changed
 * @param value - the new cypher query text value
 * @param changes - the codemirror 5 EditorChange object representing what changed
 */
export type ValueChangedListener = (
  value: string,
  changes: EditorChange
) => void;
export type KeyDownListener = (event: KeyboardEvent) => void;
export type LineNumberClickListener = (
  lineNumber: number,
  event: Event
) => void;

/**
 * This is the EditorApi which wraps all of the interaction with the cypher editor
 */
export interface EditorApi {
  clearHistory: () => void;
  destroy: () => void;
  focus: () => void;
  getLineCount: () => void;
  getPosition: () => PositionObject;
  getPositionForValue: (positionValue: PositionAny) => PositionObject | null;
  selectAutocompleteOption: (autocompleteOptionIndex: number) => void;
  setAutocomplete: (autocomplete: boolean) => void;
  setAutocompleteCloseOnBlur: (autocompleteCloseOnBlur: boolean) => void;
  setAutocompleteOpen: (autocompleteOpen: boolean) => void;
  setAutocompleteSchema: (autocompleteSchema: EditorSupportSchema) => void;
  setAutocompleteTriggerStrings: (autocompleteTriggerStrings: string[]) => void;
  setHistory: (history: boolean) => void;
  setLineNumberFormatter: (
    lineNumberFormatter: (lineNumber: number, lineCount: number) => string
  ) => void;
  setLineNumbers: (lineNumbers: boolean) => void;
  setLineWrapping: (lineWrapping: boolean) => void;
  setLint: (lint: boolean) => void;
  setPlaceholder: (placeholder: string | undefined) => void;
  setPosition: (position: PositionAny) => void;
  setReadOnly: (readOnly: boolean) => void;
  setReadOnlyCursor: (readOnlyCursor: boolean) => void;
  setTheme: (theme: Theme) => void;
  setValue: (value: string, parseOnSetValue?: boolean) => void;

  onAutocompleteChanged: (listener: AutocompleteChangedListener) => () => void;
  offAutocompleteChanged: (listener: AutocompleteChangedListener) => void;
  onFocusChanged: (listener: FocusChangedListener) => () => void;
  offFocusChanged: (listener: FocusChangedListener) => void;
  onKeyDown: (listener: KeyDownListener) => () => void;
  offKeyDown: (listener: KeyDownListener) => void;
  onLineNumberClick: (listener: LineNumberClickListener) => () => void;
  offLineNumberClick: (listener: LineNumberClickListener) => void;
  onPositionChanged: (listener: PositionChangedListener) => () => void;
  offPositionChanged: (listener: PositionChangedListener) => void;
  onScrollChanged: (listener: ScrollChangedListener) => () => void;
  offScrollChanged: (listener: ScrollChangedListener) => void;
  onValueChanged: (listener: ValueChangedListener) => () => void;
  offValueChanged: (listener: ValueChangedListener) => void;

  editorSupport: CypherEditorSupport;
  codemirror: Editor;
}

/**
 * These are the options for the {@link cypher-codemirror5#createCypherEditor | createCypherEditor} function
 */
export interface EditorOptions {
  autocomplete?: boolean;
  autocompleteCloseOnBlur?: boolean;
  autocompleteOpen?: boolean;
  autocompleteSchema?: EditorSupportSchema;
  autocompleteTriggerStrings?: string[];
  autofocus?: boolean;
  history?: boolean;
  lineNumberFormatter?: (lineNumber: number, lineCount: number) => string;
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  lint?: boolean;
  parseOnSetValue?: boolean;
  placeholder?: string;
  position?: PositionAny;
  readOnly?: boolean;
  readOnlyCursor?: boolean;
  theme?: Theme;
  value?: string;

  codemirrorOptions?: any; // TODO - it'd be a lot of work, but codemirrorOptions could be typed...
}

/**
 * This is the createCypherEditor function
 */
export declare function createCypherEditor(
  parentDOMElement: Element | DocumentFragment,
  options: EditorOptions
): EditorApi;