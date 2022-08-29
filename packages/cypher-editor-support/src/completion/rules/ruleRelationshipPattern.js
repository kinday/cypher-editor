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

import * as CypherTypes from '../../lang/CypherTypes';
import * as CompletionTypes from '../CompletionTypes';
import { TreeUtils } from '../../util/TreeUtils';

// If we are in relationship pattern then return variables and types
export default (element) => {
  const parent = TreeUtils.findParent(element, CypherTypes.RELATIONSHIP_PATTERN_CONTEXT);
  if (parent) {
    // We are at the beginning, so allow variables too
    if (element.getText() === '[') {
      return [
        { type: CompletionTypes.VARIABLE },
        { type: CompletionTypes.RELATIONSHIP_TYPE },
      ];
    }
    // We are at the end, fail and allow algorithm to get back by 1 char
    if (element.getText() === ']') {
      return [];
    }
  }
  return [];
};
