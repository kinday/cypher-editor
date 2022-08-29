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

describe('Reference Traverser - Labels', () => {
  it('returns reference for a single label', () => {
    const b = new CypherEditorSupport('MATCH (n:Label)');

    const refs = b.getReferences(1, 10);
    expect(refs.map(r => reduceElement(r))).to.deep.equal([
      {
        rule: 'LabelNameContext',
        start: {
          column: 9,
          line: 1,
        },
        stop: {
          column: 13,
          line: 1,
        },
        text: 'Label',
      },
    ],
    );
  });

  it('returns references for a multiple labels', () => {
    const b = new CypherEditorSupport('MATCH (n:Label) MATCH (m:Label)');

    const refs = b.getReferences(1, 10);
    expect(refs.map(r => reduceElement(r))).to.deep.equal([
      {
        rule: 'LabelNameContext',
        start: {
          column: 9,
          line: 1,
        },
        stop: {
          column: 13,
          line: 1,
        },
        text: 'Label',
      },
      {
        rule: 'LabelNameContext',
        start: {
          column: 25,
          line: 1,
        },
        stop: {
          column: 29,
          line: 1,
        },
        text: 'Label',
      },
    ]);
  });

  it('returns references for multiple queries', () => {
    const b = new CypherEditorSupport('MATCH (n:Label); MATCH (n:Label);');

    const refs = b.getReferences(1, 10);
    expect(refs.map(r => reduceElement(r))).to.deep.equal([
      {
        rule: 'LabelNameContext',
        start: {
          column: 9,
          line: 1,
        },
        stop: {
          column: 13,
          line: 1,
        },
        text: 'Label',
      },
      {
        rule: 'LabelNameContext',
        start: {
          column: 26,
          line: 1,
        },
        stop: {
          column: 30,
          line: 1,
        },
        text: 'Label',
      },
    ]);
  });
});
