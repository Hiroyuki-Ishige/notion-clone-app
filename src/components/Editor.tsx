import { en } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
//import { useState } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string | null;
}

function Editor({ onChange, initialContent }: EditorProps) {
  //const [value, setValue] = useState(initialContent || "");

  const editor = useCreateBlockNote({
    
    dictionary: en, //set menu "Heading", "Paragraph", etc to English(en). If you want to use Japanese, change "en" to "ja".
    initialContent:
      initialContent != null ? JSON.parse(initialContent) : undefined,
  });
  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={() => onChange(JSON.stringify(editor.document))}
      />
    </div>
  );
}

export default Editor;
