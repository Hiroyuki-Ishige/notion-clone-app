import { supabase } from "@/lib/supabase";
import { sign } from "crypto";


export const noteRepository = {
  // Create a new note
  async create(userId: string, params: { title?: string; parentId?: number }) {
    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          user_id: userId,
          title: params.title,
          parent_document: params.parentId,
        },
      ])
      .select()
      .single();
    if (error !== null || data === null) throw new Error(error?.message);
    return data;
  },
  
  // Fetch notes by userId and optional parentdocumentId
  async find(userId: string, parentdocumentId?: number) {
    const query = supabase
      .from("notes")
      .select()
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const { data, error } =
      parentdocumentId != null
        ? await query.eq("parent_document", parentdocumentId)
        : await query.is("parent_document", null);

    if (error !== null) throw new Error(error?.message);
    return data;
  },

  // Fetch notes by keyword in title
  async findByKeyword(userId: string, keyword: string) {
    const { data, error } = await supabase
      .from("notes")
      .select()
      .eq("user_id", userId)
      .or(`title.ilike.%${keyword}%, content.ilike.%${keyword}%`)
      .order("created_at", { ascending: false });

    if (error !== null) throw new Error(error?.message);
    return data;
  },
  
  // Fetch a single note by its ID
  async findOne(userId: string, id: number) {
    const { data, error } = await supabase
      .from("notes")
      .select()
      .eq("user_id", userId)
      .eq("id", id)
      .single();

    if (error !== null) throw new Error(error?.message);
    return data;
  },
  
  //update note title and content
  async update(id: number, note: { title?: string; content?: string }) {
    const { data, error } = await supabase
      .from("notes")
      .update(note)
      .eq("id", id)
      .select()
      .single();

    if (error !== null) throw new Error(error?.message);
    return data;
  },

  //delete note by id
  async delete(id: number) {
    const { data, error } = await supabase.rpc('delete_children_notes_recursively', { note_id: id });

    if (error !== null) throw new Error(error?.message);
    return true;
  },

  
};