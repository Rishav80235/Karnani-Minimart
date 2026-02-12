import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Product } from '@/data/products';
import {
  useProducts,
  useCategories,
  useProductMutations,
  useCategoryMutations,
  type Category,
} from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Package, ShoppingCart, IndianRupee, TrendingUp, Tags } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { data: productList = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { createProduct, updateProduct, deleteProduct } = useProductMutations();
  const { createCategory, updateCategory, deleteCategory } = useCategoryMutations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    unit: '',
    image: '',
    description: '',
  });

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    { label: 'Total Products', value: productList.length, icon: Package, color: 'text-primary' },
    {
      label: 'Categories',
      value: categories.length,
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      label: 'Avg Price',
      value:
        productList.length > 0
          ? `₹${Math.round(productList.reduce((s, p) => s + p.price, 0) / productList.length)}`
          : '₹0',
      icon: IndianRupee,
      color: 'text-primary',
    },
    {
      label: 'Brands',
      value: new Set(productList.map((p) => p.brand)).size,
      icon: ShoppingCart,
      color: 'text-primary',
    },
  ];

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: '',
      category: categories[0]?.name ?? '',
      price: '',
      unit: '',
      image: '',
      description: '',
    });
    setDialogOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: String(p.price),
      unit: p.unit,
      image: p.image ?? '',
      description: p.description ?? '',
    });
    setDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.brand || !productForm.category || !productForm.price || !productForm.unit) {
      toast.error('Please fill all required fields');
      return;
    }
    const price = Number(productForm.price);
    if (isNaN(price) || price < 0) {
      toast.error('Invalid price');
      return;
    }
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          ...editingProduct,
          name: productForm.name,
          brand: productForm.brand,
          category: productForm.category,
          price,
          unit: productForm.unit,
          image: productForm.image || undefined,
          description: productForm.description || undefined,
        });
        toast.success('Product updated');
      } else {
        await createProduct.mutateAsync({
          name: productForm.name,
          brand: productForm.brand,
          category: productForm.category,
          price,
          unit: productForm.unit,
          image: productForm.image || undefined,
          description: productForm.description || undefined,
        });
        toast.success('Product added');
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Product deleted');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete product');
    }
  };

  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDialogOpen(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCategoryName(c.name);
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    const name = categoryName.trim();
    if (!name) {
      toast.error('Category name is required');
      return;
    }
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, name });
        toast.success('Category updated');
      } else {
        await createCategory.mutateAsync(name);
        toast.success('Category added');
      }
      setCategoryDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    const used = productList.filter((p) => p.category === cat?.name).length;
    if (used > 0) {
      toast.error(`Cannot delete: ${used} product(s) use this category. Change their category first.`);
      return;
    }
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success('Category deleted');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete category');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="products">
            <TabsList className="mb-4">
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <Tags className="h-4 w-4" />
                Categories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="mb-4 flex justify-end">
                <Button onClick={openAddProduct}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Product
                </Button>
              </div>
              <div className="rounded-xl border bg-card overflow-hidden">
                {productsLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading products...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productList.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>{p.brand}</TableCell>
                          <TableCell>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {p.category}
                            </span>
                          </TableCell>
                          <TableCell>₹{p.price}</TableCell>
                          <TableCell>{p.unit}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => openEditProduct(p)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="mb-4 flex justify-end">
                <Button onClick={openAddCategory}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Category
                </Button>
              </div>
              <div className="rounded-xl border bg-card overflow-hidden">
                {categoriesLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => openEditCategory(c)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteCategory(c.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Product Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Product Name *</Label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Brand *</Label>
                <Input
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(v) => setProductForm({ ...productForm, category: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Unit *</Label>
                <Input
                  value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                  className="mt-1"
                  placeholder="e.g. 1 Kg"
                />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                className="mt-1"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="mt-1"
                rows={3}
                placeholder="Product description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={
                createProduct.isPending ||
                updateProduct.isPending ||
                !productForm.name ||
                !productForm.brand ||
                !productForm.category ||
                !productForm.price ||
                !productForm.unit
              }
            >
              {editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Add/Edit Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label>Category Name *</Label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1"
              placeholder="e.g. Cheese"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={
                createCategory.isPending ||
                updateCategory.isPending ||
                !categoryName.trim()
              }
            >
              {editingCategory ? 'Update' : 'Add'} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
