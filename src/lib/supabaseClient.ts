import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase";

const supabaseUrl = "https://bkjeoirmhsduobfceoli.supabase.co";
// Note: We use the newly generated modern publishable key.
const supabaseAnonKey = "sb_publishable_uZPwu-CVffE0GDHNCIZ6cg_-rMv_TpZ";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
