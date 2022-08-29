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

import { expect } from 'chai';
import { CypherEditorSupport } from '../../src/CypherEditorSupport';
import { reduceElement } from '../util';

describe('Reference Traverser - Parameters', () => {
  it('returns reference for a single parameter', () => {
    const b = new CypherEditorSupport('RETURN $param;');

    const refs = b.getReferences(1, 10);
    expect(refs.map(r => reduceElement(r))).to.deep.equal([
      {
        rule: 'ParameterNameContext',
        start: {
          column: 8,
          line: 1,
        },
        stop: {
          column: 12,
          line: 1,
        },
        text: 'param',
      },
    ]);
  });

  it('returns reference for multiple parameters', () => {
    const b = new CypherEditorSupport('MATCH (n) SET n.key = $param SET n.key = {param}');

    const refs = b.getReferences(1, 45);

    expect(refs.map(r => reduceElement(r))).to.deep.equal([
      {
        rule: 'ParameterNameContext',
        start: {
          column: 23,
          line: 1,
        },
        stop: {
          column: 27,
          line: 1,
        },
        text: 'param',
      },
      {
        rule: 'ParameterNameContext',
        start: {
          column: 42,
          line: 1,
        },
        stop: {
          column: 46,
          line: 1,
        },
        text: 'param',
      },
    ]);
  });

  it('returns references for multiple queries', () => {
    const b = new CypherEditorSupport(`MATCH (n) SET n.key = $param SET n.key = {param};
          MATCH (n) SET n.key = $param SET n.key = {param};`);

    const refs = b.getReferences(1, 25);
    expect(refs.map(r => reduceElement(r))).to.deep.equal([
      {
        rule: 'ParameterNameContext',
        start: {
          column: 23,
          line: 1,
        },
        stop: {
          column: 27,
          line: 1,
        },
        text: 'param',
      },
      {
        rule: 'ParameterNameContext',
        start: {
          column: 42,
          line: 1,
        },
        stop: {
          column: 46,
          line: 1,
        },
        text: 'param',
      },
      {
        rule: 'ParameterNameContext',
        start: {
          column: 83,
          line: 2,
        },
        stop: {
          column: 87,
          line: 2,
        },
        text: 'param',
      },
      {
        rule: 'ParameterNameContext',
        start: {
          column: 102,
          line: 2,
        },
        stop: {
          column: 106,
          line: 2,
        },
        text: 'param',
      },
    ]);
  });
});
