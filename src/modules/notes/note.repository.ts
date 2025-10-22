import { supabase } from "@/lib/supabase";


export const noteRepository = {
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
};
