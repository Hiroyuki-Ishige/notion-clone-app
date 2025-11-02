import { Note } from "@/types/note";
import { on } from "events";
import { useState } from "react";
import TextAreaAutoSize from "react-textarea-autosize";

interface TitleInputProps {
  initialData?: Note;
  onTitleChange?: (val: string) => void;
}

export function TitleInput({ initialData, onTitleChange }: TitleInputProps) {
  const [value, setValue] = useState(initialData?.title || "Untitled-Test");

  const handleInputChange = (newValue: string) => {
    setValue(newValue);
    onTitleChange?.(newValue);
  };
  return (
    <div className="pl-[54px] group relative">
      <TextAreaAutoSize
        className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] resize-none"
        placeholder="Untitled"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </div>
  );
}
