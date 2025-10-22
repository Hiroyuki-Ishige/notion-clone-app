export interface Note {
  id: number;
  title: string | null;
  content?: string | null;
  
  created_at: string;

  parent_document?: number | null;
  // updated_at: string;
  // displayTitle: string;
}
