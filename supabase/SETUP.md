# Supabase setup (15 minutes)

The app runs **without** this — it falls back to the synthetic fleet in
`src/lib/data.ts`. Follow these steps to switch it onto a real database and
unlock the admin panel.

## 1. Create the project
supabase.com → New project. Keep the database password somewhere safe.

## 2. Create the schema
Dashboard → **SQL Editor** → New query → paste all of `supabase/schema.sql` → **Run**.

This creates the tables, the `profiles` role table, and the row-level security
policies. Read the policies before trusting them: the vehicle record is
world-readable by design (it is the public record the whole demo is about), and
everything else is admin-only.

## 3. Wire the keys
Dashboard → **Project Settings → API**. Copy into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

The service-role key **bypasses row-level security**. Server-side only. Never
prefix it with `NEXT_PUBLIC_`, never paste it in a chat, never commit it.

For the live site, add the same three via `vercel env add <NAME> production`.

## 4. Create your admin account
1. Dashboard → **Authentication → Users → Add user**. Set an email and password.
   (Use a real address you control; this is a staff account, not a citizen one.)
2. SQL Editor, replacing the address:

```sql
insert into public.profiles (id, email, role)
select id, email, 'super_admin' from auth.users where email = 'you@example.com'
on conflict (id) do update set role = 'super_admin';
```

Signing in is **not** authorisation. Without that role row, a signed-in user is
refused by both the app and the database.

## 5. Seed the demo fleet
With the env vars set and the dev server running:

```bash
bun run seed
```

Then sign in at `/admin/login` and the panel will report `supabase` instead of
`mock`.

## Safety

Every row is synthetic. Do not load real registration numbers, real owner names,
real phone numbers, or any real personal data into this database — the hackathon
rules forbid it and there is no reason to.
