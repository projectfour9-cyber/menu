import { createClient } from '@supabase/supabase-js';
import { MenuPreferences, GeneratedMenu, MenuItem, SubMenuItem, UserProfile } from "../types";

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BANNER_COLLECTION: Record<string, string> = {
  "Indian": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1200",
  "Italian": "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&q=80&w=1200",
  "Asian": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200",
  "French": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1200",
  "Mediterranean": "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200",
  "Mexican": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=1200",
  "American": "https://images.unsplash.com/photo-1460306423918-99f1390ca001?auto=format&fit=crop&q=80&w=1200",
  "Any / Mix": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200"
};

// ---- Supabase-backed Dish Bank ----

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};

export const fetchCuisineList = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('dishes')
    .select('cuisine');

  if (error) throw error;

  const unique = Array.from(
    new Set((data ?? []).map((r: any) => r.cuisine).filter(Boolean))
  );

  unique.sort((a, b) => a.localeCompare(b));
  return unique;
};

export const fetchDishesByCuisine = async (inputCuisine: string): Promise<Record<string, MenuItem[]>> => {
  let query = supabase
    .from('dishes')
    .select('id, name, description, "dietaryTags", "imageUrl", category, cuisine, sub_menu_items (id, name, description, "dietaryTags")');

  // Mapping logic for UI -> DB values
  const mappings: Record<string, string[]> = {
    "Indian": ['Punjabi/North Indian', 'South Indian', 'Mughlai'],
    "Asian": ['Chinese'],
    "American": ['Continental'],
    "Mexican": ['Continental'], // Fallback
    "French": ['Continental']   // Fallback
  };

  // If "Any / Mix" or a combined cuisine string (e.g. "Indian + Italian"), fetch everything
  // to ensure we have options.
  if (inputCuisine === "Any / Mix" || inputCuisine.includes(" + ")) {
    // No filter applied -> fetches all
  } else if (mappings[inputCuisine]) {
    query = query.in('cuisine', mappings[inputCuisine]);
  } else {
    // Exact match for Italian, Mediterranean, or others
    query = query.eq('cuisine', inputCuisine);
  }

  query = query.order('category', { ascending: true })
    .order('name', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;

  const grouped: Record<string, MenuItem[]> = {};
  for (const row of data ?? []) {
    // Normalize the category using the shared logic
    const categoryKey = categoryToBucket(row.category);

    if (!grouped[categoryKey]) grouped[categoryKey] = [];
    grouped[categoryKey].push({
      id: row.id,
      name: row.name,
      description: row.description ?? '',
      dietaryTags: row.dietaryTags ?? [],
      imageUrl: row.imageUrl ?? '',
      subMenuItems: row.sub_menu_items ?? []
    });
  }

  return grouped;
};

export const fetchBannerForCuisine = async (cuisine: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('banners')
    .select('image_url')
    .eq('cuisine', cuisine)
    .maybeSingle();

  if (error) throw error;
  return data?.image_url ?? null;
};


export const addDishToLibrary = async (cuisine: string, category: string, dish: MenuItem): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('dishes')
    .insert([{ ...dish, cuisine, category }])
    .select('id, name, description, "dietaryTags", "imageUrl"')
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    description: data.description ?? '',
    dietaryTags: data.dietaryTags ?? [],
    imageUrl: data.imageUrl ?? ''
  };
};

export const updateDish = async (dishId: string, updates: Partial<MenuItem>, newCuisine?: string): Promise<void> => {
  const payload: any = { ...updates };
  if (newCuisine) payload.cuisine = newCuisine;

  // Remove id from payload if present to avoid PK update error (though usually harmless if same)
  delete payload.id;

  const { error } = await supabase
    .from('dishes')
    .update(payload)
    .eq('id', dishId);

  if (error) throw error;
};

// ---- Sub-menu items ----

export const addSubMenuItem = async (dish_id: string, item: SubMenuItem): Promise<SubMenuItem> => {
  const { data, error } = await supabase
    .from('sub_menu_items')
    .insert([{ ...item, dish_id }])
    .select('id, name, description, "dietaryTags"')
    .single();

  if (error) throw error;
  return data as SubMenuItem;
};

export const updateSubMenuItem = async (itemId: string, updates: Partial<SubMenuItem>): Promise<void> => {
  const { error } = await supabase
    .from('sub_menu_items')
    .update(updates)
    .eq('id', itemId);

  if (error) throw error;
};

// ---- Admin users ----

export const listProfiles = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, email')
    .order('email', { ascending: true });

  if (error) throw error;
  return (data ?? []) as UserProfile[];
};

export const updateProfileRole = async (userId: string, role: 'admin' | 'staff'): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) throw error;
};

const getAccessToken = async () => {
  const { data } = await supabase.auth.getSession();
  const session = data?.session;
  if (!session) return null;

  const expiresAtMs = session.expires_at ? session.expires_at * 1000 : 0;
  const shouldRefresh = expiresAtMs > 0 && Date.now() > (expiresAtMs - 60_000);

  if (shouldRefresh) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    return refreshed?.session?.access_token || null;
  }

  return session.access_token || null;
};

export const adminCreateUser = async (
  payload: { email: string; password: string; role: 'admin' | 'staff' },
  options?: { debug?: boolean }
) => {
  const accessToken = await getAccessToken();
  const debug = options?.debug;
  const { data, error } = await supabase.functions.invoke(debug ? 'admin-users?debug=1' : 'admin-users', {
    body: {
      action: 'create',
      email: payload.email,
      password: payload.password,
      role: payload.role
    },
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}`, ...(debug ? { "x-debug": "1" } : {}) }
      : undefined
  });

  if (error) throw error;
  return data as { userId: string; profile: UserProfile };
};

export const adminDeleteUser = async (userId: string, options?: { debug?: boolean }): Promise<void> => {
  const accessToken = await getAccessToken();
  const debug = options?.debug;
  const { error } = await supabase.functions.invoke(debug ? 'admin-users?debug=1' : 'admin-users', {
    body: {
      action: 'delete',
      userId
    },
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}`, ...(debug ? { "x-debug": "1" } : {}) }
      : undefined
  });

  if (error) throw error;
};

export const deleteSubMenuItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('sub_menu_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
};

export const fetchSubMenuItemsByDishId = async (dishId: string): Promise<SubMenuItem[]> => {
  const { data, error } = await supabase
    .from('sub_menu_items')
    .select('id, name, description, "dietaryTags"')
    .eq('dish_id', dishId)
    .order('name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as SubMenuItem[];
};

// ---- Menu generation (still mock-based for now) ----
// If you want, next we’ll refactor this to pull from Supabase too.

function pickRandomItems(list: MenuItem[], count: number): MenuItem[] {
  if (!list || list.length === 0 || count <= 0) return [];
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// DB category -> internal bucket
function categoryToBucket(category: string): keyof MenuPreferences["composition"] {
  const c = (category || "").toLowerCase();

  if (c.includes("starter") || c.includes("appet") || c.includes("snack")) return "appetizers";
  if (c.includes("main") || c.includes("entree")) return "mains";
  if (c.includes("live") || c.includes("station") || c.includes("counter")) return "liveStations";
  if (c.includes("side") || c.includes("accomp") || c.includes("bread") || c.includes("rice")) return "sides";
  if (c.includes("dessert") || c.includes("sweet")) return "desserts";
  if (c.includes("bever") || c.includes("drink")) return "beverages";

  // don't drop dishes on the floor
  return "mains";
}

function bucketToSectionTitle(bucket: keyof MenuPreferences["composition"]) {
  switch (bucket) {
    case "appetizers": return "Appetizers & Starters";
    case "mains": return "Main Course Selection";
    case "liveStations": return "Live Stations";
    case "sides": return "Accompaniments";
    case "desserts": return "The Grand Finale (Desserts)";
    case "beverages": return "Beverage Craft";
    default: return "Selection";
  }
}

export const fetchMenuFromBackend = async (prefs: MenuPreferences): Promise<GeneratedMenu> => {
  const budgetQualifiers: Record<string, string> = {
    luxury: "Exquisite and opulent",
    premium: "Sophisticated and elevated",
    standard: "Classic and delightful",
    budget: "Casual and inviting"
  };

  // cuisines selected in the UI
  const selected = (prefs.cuisines ?? []).filter(Boolean);
  const isAnyMix = selected.length === 0 || selected[0] === "Any / Mix";



  // If Any/Mix: pull from all cuisines. Otherwise pull from selected cuisines.
  let query = supabase
    .from("dishes")
    .select('id, name, description, "dietaryTags", "imageUrl", cuisine, category, sub_menu_items (id, name, description, "dietaryTags")');

  if (!isAnyMix) {
    query = query.in("cuisine", selected);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = data ?? [];

  // Build buckets
  const buckets: Record<keyof MenuPreferences["composition"], MenuItem[]> = {
    appetizers: [],
    mains: [],
    liveStations: [],
    sides: [],
    desserts: [],
    beverages: []
  };

  for (const row of rows as any[]) {
    const bucket = categoryToBucket(row.category);
    buckets[bucket].push({
      id: row.id,
      name: row.name,
      description: row.description ?? "",
      dietaryTags: row.dietaryTags ?? [],
      imageUrl: row.imageUrl ?? "",
      subMenuItems: row.sub_menu_items ?? []
    });
  }

  // Create sections based on composition
  const compositionKeys = Object.keys(prefs.composition) as (keyof MenuPreferences["composition"])[];
  const sections = compositionKeys
    .map((bucket) => ({
      category: bucketToSectionTitle(bucket),
      items: pickRandomItems(buckets[bucket], prefs.composition[bucket])
    }))
    .filter((s) => s.items.length > 0);



  // Title/cuisine label
  const cuisineLabel =
    isAnyMix ? "Any / Mix" :
      selected.length === 1 ? selected[0] :
        selected.join(" + ");

  const banner = await fetchBannerForCuisine(cuisineLabel);

  return {
    title: prefs.eventName || `${budgetQualifiers[prefs.budgetLevel] ?? "Curated"} ${cuisineLabel} Feast`,
    eventDescription: `A ${prefs.eventType.toLowerCase()} curated exclusively for <b>${prefs.clientName || "our guest of honor"}</b>. This ${(budgetQualifiers[prefs.budgetLevel] ?? "curated").toLowerCase()} selection celebrates the vibrant heritage of ${cuisineLabel} cuisine, tailored for an intimate gathering of ${prefs.guestCount} guests.`,
    sections,
    winePairing: `To complement these flavors, we suggest a full-bodied red for the mains and a crisp, aromatic white for the starters.`,
    chefsNotes: `This menu has been architected with a focus on seasonal integrity and visual drama. ${prefs.internalNotes || "We've ensured a balance of textures and temperatures to provide a continuous culinary journey."
      }`,
    // vibeDescription: BANNER_COLLECTION[cuisineLabel] || BANNER_COLLECTION["Any / Mix"],
    vibeDescription: banner || BANNER_COLLECTION[cuisineLabel] || BANNER_COLLECTION["Any / Mix"],

    cuisineRegion: cuisineLabel
  };
};


// ---- Menu History ----

export const saveMenuToHistory = async (prefs: MenuPreferences, menu: GeneratedMenu): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('menus')
    .insert([
      {
        user_id: user.id,
        title: menu.title,
        menu_data: menu,
        client_name: prefs.clientName,
        event_name: prefs.eventName,
        guest_count: prefs.guestCount,
        event_date: prefs.date
      }
    ]);

  if (error) throw error;
};

export const fetchMenuHistory = async () => {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteMenuFromHistory = async (menuId: string) => {
  const { error } = await supabase
    .from('menus')
    .delete()
    .eq('id', menuId);

  if (error) throw error;
};
