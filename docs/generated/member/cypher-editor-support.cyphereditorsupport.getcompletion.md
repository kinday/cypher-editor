<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [cypher-editor-support](./cypher-editor-support.md) &gt; [CypherEditorSupport](./cypher-editor-support.cyphereditorsupport.md) &gt; [getCompletion](./cypher-editor-support.cyphereditorsupport.getcompletion.md)

## CypherEditorSupport.getCompletion() method

<b>Signature:</b>

```typescript
getCompletion(
    line: number,
    column: number,
    doFilter?: boolean
  ): {
    from: EditorSupportPosition;
    to: EditorSupportPosition;
    items: EditorSupportCompletionItem[];
  };
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  line | number |  |
|  column | number |  |
|  doFilter | boolean | <i>(Optional)</i> |

<b>Returns:</b>

{ from: [EditorSupportPosition](./cypher-editor-support.editorsupportposition.md)<!-- -->; to: [EditorSupportPosition](./cypher-editor-support.editorsupportposition.md)<!-- -->; items: [EditorSupportCompletionItem](./cypher-editor-support.editorsupportcompletionitem.md)<!-- -->\[\]; }
