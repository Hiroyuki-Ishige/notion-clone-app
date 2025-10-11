import { Note } from '@/types/note';
import TextAreaAutoSize from 'react-textarea-autosize';

interface TitleInputProps {
  initialData?: Note;
  onTitleChange?: (val: string) => void;
}

export function TitleInput({ initialData, onTitleChange }: TitleInputProps) {
  return (
    <div className="pl-[54px] group relative">
      <TextAreaAutoSize
        className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] resize-none"
        placeholder="Untitled"
        value={initialData?.title || ""}
        onChange={(e) => onTitleChange?.(e.target.value)}
      />
    </div>
  );
}
