import { serve } from "https://deno.land/std@0.204.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const MENU_SUPABASE_URL = Deno.env.get("MENU_SUPABASE_URL") ?? "";
const MENU_SUPABASE_ANON_KEY = Deno.env.get("MENU_SUPABASE_ANON_KEY") ?? "";
const MENU_SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("MENU_SUPABASE_SERVICE_ROLE_KEY") ?? "";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const resolvedUrl = SUPABASE_URL || MENU_SUPABASE_URL;
const resolvedAnonKey = SUPABASE_ANON_KEY || MENU_SUPABASE_ANON_KEY;
const resolvedServiceKey = SUPABASE_SERVICE_ROLE_KEY || MENU_SUPABASE_SERVICE_ROLE_KEY;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const jsonResponse = (payload: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!resolvedUrl || !resolvedAnonKey || !resolvedServiceKey) {
    return jsonResponse({ error: "Missing Supabase environment variables" }, 500);
  }

  const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization") ?? "";
  if (!authHeader) {
    return jsonResponse({ error: "Unauthorized: missing Authorization header" }, 401);
  }
  const accessToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : authHeader;

  const userClient = createClient(resolvedUrl, resolvedAnonKey, {
    auth: { persistSession: false }
  });

  const { data: { user }, error: userError } = await userClient.auth.getUser(accessToken);
  if (userError || !user) {
    return jsonResponse({ error: userError?.message || "Unauthorized" }, 401);
  }

  const { data: profile, error: profileError } = await userClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  const body = await req.json();
  const action = body?.action;

  const serviceClient = createClient(resolvedUrl, resolvedServiceKey, {
    auth: { persistSession: false }
  });

  if (action === "create") {
    const { email, password, role } = body ?? {};
    if (!email || !password || !role) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    const { data, error } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) {
      return jsonResponse({ error: error.message }, 400);
    }

    const userId = data.user?.id;
    if (!userId) {
      return jsonResponse({ error: "User creation failed" }, 500);
    }

    const { error: roleError } = await serviceClient
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (roleError) {
      return jsonResponse({ error: roleError.message }, 500);
    }

    const { data: profileData } = await serviceClient
      .from("profiles")
      .select("id, role, email")
      .eq("id", userId)
      .single();

    return jsonResponse({
      userId,
      profile: profileData
    });
  }

  if (action === "delete") {
    const { userId } = body ?? {};
    if (!userId) {
      return jsonResponse({ error: "Missing userId" }, 400);
    }
    if (userId === user.id) {
      return jsonResponse({ error: "You cannot delete your own account" }, 400);
    }

    const { error } = await serviceClient.auth.admin.deleteUser(userId);
    if (error) {
      return jsonResponse({ error: error.message }, 400);
    }

    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: "Unknown action" }, 400);
});
