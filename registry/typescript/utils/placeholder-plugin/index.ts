import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

/**
 * Simple placeholder plugin for ProseMirror
 * @usage
 * ```ts
 * EditorState.create({
 *  schema: editorSchema,
 *  plugins: [
 *    ...,
 *    placeholderPlugin("Start typing..")
 *   ],
 * })
 * ```
 *  */
export function placeholderPlugin(placeholderText: string) {
  return new Plugin({
    props: {
      decorations(state) {
        const { doc } = state;
        const decorations: Decoration[] = [];

        // Check if the document is empty
        if (
          doc.childCount === 1 &&
          doc.firstChild?.isTextblock &&
          doc.textContent.length === 0
        ) {
          // Create a placeholder decoration
          const placeholder = Decoration.widget(0, () => {
            const span = document.createElement("span");
            span.textContent = placeholderText;
            span.className =
              "ProseMirror-placeholder text-muted-foreground pointer-events-none select-none absolute";
            return span;
          });

          decorations.push(placeholder);
        }

        return DecorationSet.create(doc, decorations);
      },
    },
  });
}
