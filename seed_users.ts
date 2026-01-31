
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

// Local Supabase connection string
const DB_CONNECTION_STRING = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const users = [
    { email: 'admin@gourmet.com', password: 'password123', role: 'admin' },
    { email: 'staff@gourmet.com', password: 'password123', role: 'staff' }
];

async function seed() {
    console.log('Seeding users...');

    // PG Client for direct updates
    const pgClient = new Client({ connectionString: DB_CONNECTION_STRING });
    await pgClient.connect();

    for (const u of users) {
        console.log(`Creating ${u.email}...`);

        // 1. Create User via Auth API
        const { data, error } = await supabase.auth.signUp({
            email: u.email,
            password: u.password,
        });

        if (error) {
            console.log(`Error creating ${u.email}:`, error.message);
        } else {
            const userId = data.user?.id;
            console.log(`Created ${u.email} (ID: ${userId})`);

            // 2. Update Role if Admin
            if (u.role === 'admin' && userId) {
                console.log('Updating admin role...');
                try {
                    await pgClient.query(`UPDATE public.profiles SET role = 'admin' WHERE id = $1`, [userId]);
                    console.log('Admin role updated successfully.');
                } catch (err) {
                    console.error('Failed to update admin role:', err);
                }
            }
        }
    }

    await pgClient.end();
}

seed();
