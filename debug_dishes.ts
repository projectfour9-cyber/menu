
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''; // We might need to grab this from .env.local manually if it's not loading right, but try this.

console.log('Connecting to:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testFetch(cuisine: string) {
    console.log(`\nTesting fetch for cuisine: "${cuisine}"`);
    const { data, error } = await supabase
        .from('dishes')
        .select('name, category, cuisine')
        .eq('cuisine', cuisine);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data?.length} dishes.`);
    if (data && data.length > 0) {
        const categories = new Set(data.map(d => d.category));
        console.log('Categories found:', Array.from(categories));
    }
}

async function fetchAll() {
    console.log(`\nFetching ALL dishes`);
    const { data, error } = await supabase
        .from('dishes')
        .select('name, category, cuisine');
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log(`Total dishes in DB: ${data?.length}`);
    const cuisines = new Set(data.map(d => d.cuisine));
    console.log('Cuisines in DB:', Array.from(cuisines));
}

async function run() {
    await fetchAll();
    await testFetch('North Indian'); // Test what might be missing
    await testFetch('Punjabi/North Indian'); // Test exact match
    await testFetch('Any / Mix'); // Test the problematic one
}

run();
