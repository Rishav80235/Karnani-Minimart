# Supabase: Full Setup & CRUD Guide

Step-by-step process to access Supabase data, login (Google), and full database Create, Read, Update, Delete (CRUD) for **Karnani Mini Mart**.

---

## Part 1: Create Supabase Project & Get Keys

### Step 1.1 – Create a project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose **Organization**, **Name** (e.g. `karnani-minimart`), **Database password** (save it), **Region**.
4. Click **Create new project** and wait until it’s ready.

### Step 1.2 – Get URL and API keys

1. In the project, open **Project Settings** (gear icon) → **API**.
2. Copy and save:
   - **Project URL** (e.g. `https://xxxx.supabase.co`)
   - **anon public** key (under “Project API keys”) — this is used by your frontend.

---

## Part 2: Environment Variables (App Access to Supabase)

### Step 2.1 – Create `.env` in project root

In your repo root (same folder as `package.json`), create or edit `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key_here
```

Replace with your **Project URL** and **anon public** key from Step 1.2.

### Step 2.2 – Restart dev server

After changing `.env`, restart the app (e.g. `npm run dev`). The client is configured in `src/integrations/supabase/client.ts` and reads these variables.

---
  
## Part 3: Database Tables & RLS (Create Schema)

Your app expects two main tables: **products** and **categories**, plus **user_roles** for admin access. Apply the migrations so the database and RLS match the app.

### Option A: Use Supabase CLI (requires login first)

If you see **"Access token not provided"** or **"Cannot find project ref"**, do these in order:

**1. Log in to Supabase CLI** (opens browser):

```bash
npx supabase login
```

**2. Link this folder to your Supabase project:**

```bash
npx supabase link
```

When prompted, choose your project or enter your **Project ref** (Dashboard → Project Settings → General).

**3. Push migrations:**

```bash
npx supabase db push
```

This runs all SQL files in `supabase/migrations/` in order:

- **user_roles + auth trigger** – roles and auto-admin for a specific email.
- **products + categories** – tables, RLS policies, seed data.
- **allow anon read** – so the app (anon key) can read products/categories.

### Option B: Use Dashboard only (no CLI)

If you don’t use the CLI:

1. Open [supabase.com](https://supabase.com) → your project → **SQL Editor** → **New query**.
2. Run **each** migration **one at a time** in this order:
   - **First:** Copy **all** of `supabase/migrations/20260212103439_7d02e213-6cc7-41df-9940-f86ed35dc256.sql` → paste → **Run**.
   - **Second:** Copy **all** of `supabase/migrations/20260212140000_products_categories.sql` → paste → **Run**.
   - **Third:** Copy **all** of `supabase/migrations/20260212150000_allow_anon_read_products_categories.sql` → paste → **Run**.
3. If you see "already exists", that part is done — continue. Fix any other errors before the next query.

### Step 3.3 – Tables overview

| Table         | Purpose |
|--------------|---------|
| `auth.users` | Supabase Auth (Google sign-in creates rows here). |
| `public.user_roles` | Links `user_id` to role (`admin` / `user`). |
| `public.categories` | Product categories (id, name, sort_order). |
| `public.products`   | Products (id, name, brand, category, price, unit, image, description, etc.). |

**Row Level Security (RLS):**

- **products / categories**: Anyone (including anon) can **SELECT**. Only **authenticated** users with **admin** role can INSERT/UPDATE/DELETE.
- **user_roles**: Only authenticated users can read their own row.

---

## Part 4: Login & Authentication (Google)

### Step 4.1 – Enable Google in Supabase

1. **Authentication** → **Providers** → **Google** → Enable.
2. Use a **Google Cloud Console** OAuth client (Web application type).
3. Copy **Client ID** and **Client Secret** into Supabase Google provider.
4. In Google OAuth client, set **Authorized redirect URI** to:
   ```text
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```

### Step 4.2 – Add site URL / redirect URLs (optional)

1. **Authentication** → **URL Configuration**.
2. **Site URL**: e.g. `http://localhost:5173` (dev) or your production URL.
3. **Redirect URLs**: add `http://localhost:5173/`, `http://localhost:5173`, and your production URL if needed.

Your app uses `window.location.origin` as redirect after login (`src/pages/Login.tsx`), so localhost and production both work if the callback above is set.

### Step 4.3 – Who becomes admin?

In the migration `20260212103439_*.sql`, the trigger `handle_new_user_role` inserts into `user_roles` when a user signs up. It gives **admin** only if:

```sql
IF NEW.email = 'rishavaeron80235@gmail.com' THEN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
END IF;
```

To change the admin email:

1. **SQL Editor** → Copy and run the contents of `supabase/migrations/UPDATE_ADMIN_EMAIL.sql`, replacing `'your-admin@example.com'` with your actual admin email.
2. For an **existing** user, add a row manually in **Table Editor** → `user_roles`: set `user_id` = their `auth.users.id`, `role` = `admin`. Or run:
   ```sql
   INSERT INTO public.user_roles (user_id, role) 
   SELECT id, 'admin' FROM auth.users WHERE email = 'your-admin@example.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

### Step 4.4 – Turn off “test mode” auth (optional)

In `src/hooks/useAuth.tsx`, the flag **DISABLE_AUTH_FOR_TESTING** is now set to **`false`** by default, so the app uses real Google login and admin checks.

- If you need to temporarily disable auth for testing, set it to **`true`** (the app will pretend an admin is logged in).
- For production, keep it as **`false`**.

---

## Part 5: How the App Uses Supabase (Data Flow)

### 5.1 – Client (single instance)

All Supabase access goes through one client:

- **File:** `src/integrations/supabase/client.ts`
- **Usage:** `import { supabase } from '@/integrations/supabase/client';`
- Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key). Session is stored in `localStorage` and refreshed automatically.

### 5.2 – Auth (login state & admin)

- **File:** `src/hooks/useAuth.tsx`
- **Exports:** `useAuth()`, `AuthProvider`
- **Behavior:**
  - Listens to `supabase.auth.onAuthStateChange` and `getSession()`.
  - For logged-in user, checks admin with: `supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin')`.
  - Exposes: `user`, `session`, `isAdmin`, `loading`, `signOut`.

Login page (`src/pages/Login.tsx`) calls:

- `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: origin } })` for Google sign-in.
- Redirects to `/admin` when `user` and `isAdmin` are set.

### 5.3 – Products & categories (CRUD)

- **File:** `src/hooks/useProducts.ts`
- **Read:** `fetchProducts()` and `fetchCategories()` run `supabase.from('products').select('*')` and `supabase.from('categories').select('*')`.
- **Create / Update / Delete:** Implemented with `supabase.from('products').insert/update/delete` and same for `categories`, used via `useProductMutations()` and `useCategoryMutations()`.

All of this uses Supabase data only (no static list). The UI reads from these hooks (e.g. home page list, admin table, filters).

---

## Part 6: Database CRUD Reference

> **📖 See also:** `docs/CRUD_EXAMPLES.md` for complete working code examples from the app.

### 6.1 – READ (list products / categories)

**Products:**

```ts
const { data, error } = await supabase
  .from('products')
  .select('*')
  .order('name');
// data = array of rows; error if RLS or network issue
```

**Categories:**

```ts
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .order('sort_order');
```

In the app these are used by `fetchProducts()` and `fetchCategories()` in `src/hooks/useProducts.ts`, and exposed as `useProducts()` and `useCategories()` (React Query).

### 6.2 – CREATE (add product / category)

**Product:**

```ts
const { data, error } = await supabase
  .from('products')
  .insert({
    name: 'Product Name',
    brand: 'Brand',
    category: 'Category Name',
    price: 99.99,
    unit: '1 Kg',
    image: null,
    description: null,
  })
  .select()
  .single();
```

**Category:**

```ts
const { data, error } = await supabase
  .from('categories')
  .insert({ name: 'New Category', sort_order: 10 })
  .select()
  .single();
```

In the app: `useProductMutations().createProduct.mutateAsync(...)` and `useCategoryMutations().createCategory.mutateAsync(...)` (Admin panel and Excel import use these). Insert is allowed only for **authenticated** users with **admin** role (RLS).

### 6.3 – UPDATE (edit product / category)

**Product:**

```ts
const { data, error } = await supabase
  .from('products')
  .update({
    name: 'Updated Name',
    brand: 'Brand',
    category: 'Category',
    price: 89.99,
    unit: '500 g',
    image: null,
    description: null,
  })
  .eq('id', productId)
  .select()
  .single();
```

**Category:**

```ts
const { error } = await supabase
  .from('categories')
  .update({ name: 'Updated Category Name' })
  .eq('id', categoryId);
```

In the app: `updateProduct.mutateAsync(product)` and `updateCategory.mutateAsync({ id, name })`. Allowed only for **admin** (RLS).

### 6.4 – DELETE (remove product / category)

**Product:**

```ts
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId);
```

**Category:**

```ts
const { error } = await supabase
  .from('categories')
  .delete()
  .eq('id', categoryId);
```

In the app: `deleteProduct.mutateAsync(id)` and `deleteCategory.mutateAsync(id)`. Allowed only for **admin** (RLS).

---

## Part 7: Quick Checklist

| Step | Action |
|------|--------|
| 1 | Create Supabase project, copy **Project URL** and **anon** key. |
| 2 | Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to `.env`, restart dev server. |
| 3 | Run migrations (`npx supabase db push`) or run migration SQL in Dashboard so `products`, `categories`, `user_roles` and RLS exist. |
| 4 | Enable Google provider in Supabase Auth, set OAuth redirect to `.../auth/v1/callback`. |
| 5 | Set admin email in `handle_new_user_role` (or insert into `user_roles` for existing user). |
| 6 | `DISABLE_AUTH_FOR_TESTING` is already set to `false` in `useAuth.tsx` (real Google login enabled). |
| 7 | Open app: listing uses **Read**; Admin panel uses **Create / Update / Delete** for products and categories. |

If the Table Editor shows data but the app shows empty lists, run the migration that adds “Anyone can read products/categories” (e.g. `20260212150000_allow_anon_read_products_categories.sql`) so the anon key can SELECT. Check the browser console for `[fetchProducts]` / `[fetchCategories]` errors if something still fails.
