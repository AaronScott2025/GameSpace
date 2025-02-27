import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_REACT_APP_URL;
const API_KEY = process.env.SUPABASE_REACT_APP_API_KEY;

export const supabase = createClient(URL, API_KEY);
