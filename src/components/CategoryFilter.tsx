import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

const CategoryFilter = ({ categories, active, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => (
        <Button
          key={cat}
          size="sm"
          variant={active === cat ? 'default' : 'outline'}
          className="h-8 text-xs"
          onClick={() => onChange(cat)}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
