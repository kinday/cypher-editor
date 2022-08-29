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

import { checkCompletion, checkCompletionTypes } from './util';
import * as CompletionTypes from '../../src/completion/CompletionTypes';

describe('AutoCompletion - Node pattern', () => {
  describe('types', () => {
    it('yields label if character present', () => {
      checkCompletionTypes('MATCH (n) MATCH (a:▼b', true, [{ type: CompletionTypes.LABEL }]);
    });

    it('yields label if only colon present', () => {
      checkCompletionTypes('MATCH (n) MATCH (a▼:', true, [{ type: CompletionTypes.LABEL }]);
    });

    it('yields label if only colon present', () => {
      checkCompletionTypes('MATCH (n) MATCH (a▼:)', true, [{ type: CompletionTypes.LABEL }]);
    });

    it('yields label and variable if beginning of node pattern', () => {
      checkCompletionTypes('MATCH (n) MATCH ▼(', true, [
        { type: CompletionTypes.VARIABLE },
        { type: CompletionTypes.LABEL },
      ]);
    });

    it('yields label and variable if beginning of node pattern in chain', () => {
      checkCompletionTypes('MATCH (n) MATCH ()--()--▼(', true, [
        { type: CompletionTypes.VARIABLE },
        { type: CompletionTypes.LABEL },
      ]);
    });

    it('yields label type if only colon is present', () => {
      checkCompletionTypes('MATCH (n) MATCH (▼:', true, [
        { type: CompletionTypes.LABEL },
      ]);
    });

    it('yields label type when multiple labels', () => {
      // without the space at the end of unfinished query
      // parser recognizes ':' as start of the next statement
      checkCompletionTypes('MATCH (:SomeLabel▼: ', true, [
        { type: CompletionTypes.LABEL },
      ]);
    });
  });

  describe('without filters', () => {
    it('yields label list', () => {
      const expected = {
        from: { line: 1, column: 18 },
        to: { line: 1, column: 20 },
        items: [
          { type: CompletionTypes.LABEL, view: ':y', content: ':y', postfix: null },
          { type: CompletionTypes.LABEL, view: ':x', content: ':x', postfix: null },
        ],
      };

      checkCompletion('MATCH (n) MATCH (a:▼b', expected);
      checkCompletion('MATCH (n) MATCH (a:b▼', expected);
    });

    it('yields label list if only colon is present', () => {
      const expected = {
        from: { line: 1, column: 18 },
        to: { line: 1, column: 19 },
        items: [
          { type: CompletionTypes.LABEL, view: ':y', content: ':y', postfix: null },
          { type: CompletionTypes.LABEL, view: ':x', content: ':x', postfix: null },
        ],
      };

      checkCompletion('MATCH (n) MATCH (a:▼', expected);
    });

    it('yields label list if only colon is present and closing brace present', () => {
      const expected = {
        from: { line: 1, column: 8 },
        to: { line: 1, column: 9 },
        items: [
          { type: CompletionTypes.LABEL, view: ':y', content: ':y', postfix: null },
          { type: CompletionTypes.LABEL, view: ':x', content: ':x', postfix: null },
        ],
      };

      checkCompletion('MATCH (a:▼) MATCH ()', expected);
    });

    it('yields label and variables at the beginning of node pattern', () => {
      const expected = {
        from: { line: 1, column: 17 },
        to: { line: 1, column: 17 },
        items: [
          { type: CompletionTypes.VARIABLE, view: 'a', content: 'a', postfix: null },
          { type: CompletionTypes.LABEL, view: ':y', content: ':y', postfix: null },
          { type: CompletionTypes.LABEL, view: ':x', content: ':x', postfix: null },
        ],
      };

      checkCompletion('MATCH (a) MATCH (▼', expected);
    });
  });

  describe('with filters', () => {
    it('yields label list', () => {
      const expected = {
        from: { line: 1, column: 18 },
        to: { line: 1, column: 20 },
        items: [
          { type: CompletionTypes.LABEL, view: ':y', content: ':y', postfix: null },
        ],
      };

      checkCompletion('MATCH (n) MATCH (a:y▼', expected, true);
      checkCompletion('MATCH (n) MATCH (a:▼y', expected, true);
    });


    it('yields label list if only color is present', () => {
      const expected = {
        from: { line: 1, column: 18 },
        to: { line: 1, column: 19 },
        items: [
          { type: CompletionTypes.LABEL, view: ':y', content: ':y', postfix: null },
          { type: CompletionTypes.LABEL, view: ':x', content: ':x', postfix: null },
        ],
      };

      checkCompletion('MATCH (n) MATCH (a▼:', expected, true);
    });

    it('yields label list if only colon is present and closing brace present', () => {
      const expected = {
        from: { line: 1, column: 8 },
        to: { line: 1, column: 9 },
        items: [
          { type: CompletionTypes.LABEL, view: ':y', content: ':y', postfix: null },
          { type: CompletionTypes.LABEL, view: ':x', content: ':x', postfix: null },
        ],
      };

      checkCompletion('MATCH (a:▼) MATCH ()', expected, true);
    });

    it('yields label and variables at the beginning of node pattern', () => {
      const expected = {
        from: { line: 1, column: 17 },
        to: { line: 1, column: 17 },
        items: [
          { type: CompletionTypes.VARIABLE, view: 'a', content: 'a', postfix: null },
          { type: CompletionTypes.LABEL, view: ':y', content: ':y', postfix: null },
          { type: CompletionTypes.LABEL, view: ':x', content: ':x', postfix: null },
        ],
      };

      checkCompletion('MATCH (a) MATCH (▼', expected, true);
    });
  });
});
