# CRUD Examples - Working Code from Karnani Mini Mart

Quick reference showing actual CRUD operations used in the app.

## Products

### READ (List all products)

```typescript
// From: src/hooks/useProducts.ts
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase
  .from('products')
  .select('*')
  .order('name');

if (error) throw error;
const products = (data ?? []).map(toProduct);
```

**In React component:**
```typescript
import { useProducts } from '@/hooks/useProducts';

const { data: products = [], isLoading } = useProducts();
```

### CREATE (Add new product)

```typescript
// From: src/hooks/useProducts.ts → useProductMutations()
const { data, error } = await supabase
  .from('products')
  .insert({
    name: 'Product Name',
    brand: 'Brand',
    category: 'Category Name',
    price: 99.99,
    unit: '1 Kg',
    image: null,  // or image URL string
    description: null,  // or description string
  })
  .select()
  .single();

if (error) throw error;
```

**In React component:**
```typescript
import { useProductMutations } from '@/hooks/useProducts';

const { createProduct } = useProductMutations();
await createProduct.mutateAsync({
  name: 'Product Name',
  brand: 'Brand',
  category: 'Category',
  price: 99.99,
  unit: '1 Kg',
});
```

### UPDATE (Edit product)

```typescript
// From: src/hooks/useProducts.ts → useProductMutations()
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

if (error) throw error;
```

**In React component:**
```typescript
const { updateProduct } = useProductMutations();
await updateProduct.mutateAsync({
  id: productId,
  name: 'Updated Name',
  brand: 'Brand',
  category: 'Category',
  price: 89.99,
  unit: '500 g',
});
```

### DELETE (Remove product)

```typescript
// From: src/hooks/useProducts.ts → useProductMutations()
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId);

if (error) throw error;
```

**In React component:**
```typescript
const { deleteProduct } = useProductMutations();
await deleteProduct.mutateAsync(productId);
```

---

## Categories

### READ (List all categories)

```typescript
// From: src/hooks/useProducts.ts
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .order('sort_order');

if (error) throw error;
const categories = (data ?? []) as Category[];
```

**In React component:**
```typescript
import { useCategories } from '@/hooks/useProducts';

const { data: categories = [] } = useCategories();
```

### CREATE (Add new category)

```typescript
// From: src/hooks/useProducts.ts → useCategoryMutations()
const { data, error } = await supabase
  .from('categories')
  .insert({ name: 'New Category', sort_order: 999 })
  .select()
  .single();

if (error) throw error;
```

**In React component:**
```typescript
import { useCategoryMutations } from '@/hooks/useProducts';

const { createCategory } = useCategoryMutations();
await createCategory.mutateAsync('New Category');
```

### UPDATE (Edit category name)

```typescript
// From: src/hooks/useProducts.ts → useCategoryMutations()
const { error } = await supabase
  .from('categories')
  .update({ name: 'Updated Category Name' })
  .eq('id', categoryId);

if (error) throw error;
```

**In React component:**
```typescript
const { updateCategory } = useCategoryMutations();
await updateCategory.mutateAsync({ id: categoryId, name: 'Updated Name' });
```

### DELETE (Remove category)

```typescript
// From: src/hooks/useProducts.ts → useCategoryMutations()
const { error } = await supabase
  .from('categories')
  .delete()
  .eq('id', categoryId);

if (error) throw error;
```

**In React component:**
```typescript
const { deleteCategory } = useCategoryMutations();
await deleteCategory.mutateAsync(categoryId);
```

---

## Authentication

### Check if user is admin

```typescript
// From: src/hooks/useAuth.tsx
import { supabase } from '@/integrations/supabase/client';

const { data } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', userId)
  .eq('role', 'admin')
  .maybeSingle();

const isAdmin = !!data;
```

**In React component:**
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, isAdmin, loading } = useAuth();
```

### Sign in with Google

```typescript
// From: src/pages/Login.tsx
import { supabase } from '@/integrations/supabase/client';

await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/`,
  },
});
```

### Sign out

```typescript
// From: src/hooks/useAuth.tsx
await supabase.auth.signOut();
```

**In React component:**
```typescript
const { signOut } = useAuth();
await signOut();
```

---

## Notes

- All mutations automatically refresh the React Query cache after success.
- RLS policies: Products and categories are readable by anyone (anon), but only authenticated admin users can create/update/delete.
- Error handling: Always check `error` from Supabase responses and handle appropriately (throw, show toast, etc.).
