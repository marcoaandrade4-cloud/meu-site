import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ysujwpvxxuaiwqnqzxzg.supabase.co";

const supabaseKey =
  "sb_publishable_hCkjAPkWsyGrbWa9rHiMrQ_GPca_azF";

export const supabase = createClient(supabaseUrl, supabaseKey);
