import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type AppRole = "admin" | "employee";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export function getSupabaseClient(): SupabaseClient | null {
  return supabase;
}

export async function resolveUserRoleById(
  client: SupabaseClient,
  userId: string
): Promise<AppRole | null> {
  const { data, error } = await client
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data?.role) {
    return null;
  }

  return data.role === "admin" || data.role === "employee" ? data.role : null;
}

export async function resolveEmailByEmployeeNumber(
  client: SupabaseClient,
  employeeNumber: string
): Promise<string | null> {
  const cleanValue = employeeNumber.trim();
  if (!cleanValue) {
    return null;
  }

  const { data, error } = await client
    .from("users")
    .select("email")
    .eq("employee_number", cleanValue)
    .maybeSingle();

  if (error || !data?.email) {
    return null;
  }

  return data.email;
}
