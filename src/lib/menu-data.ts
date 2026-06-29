export type CustomizationType = 'salad-choice' | 'side-choice' | 'quantity-set';

export interface CustomizationOption {
  id: string;
  label: string;
}

export interface Customization {
  type: CustomizationType;
  label: string;
  options: CustomizationOption[];
  min: number;
  max: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'entree' | 'appetizer' | 'side' | 'dessert' | 'drink';
  image: string;
  available: boolean;
  featured: boolean;
  customizations: Customization[];
  unitLabel?: string;
}

export interface CartItem {
  menuItemId: string;
  quantity: number;
  selections: Record<string, string[]>;
  cartId: string;
}

export const SALAD_OPTIONS: CustomizationOption[] = [
  { id: 'house-salad', label: 'House Salad' },
  { id: 'caesar-salad', label: 'Caesar Salad' },
];

export const SIDE_OPTIONS: CustomizationOption[] = [
  { id: 'mash-potatoes', label: 'Herbal Garlic Mash Potatoes' },
  { id: 'chef-rice', label: 'Chef Rice' },
  { id: 'string-beans', label: 'String Beans' },
];

export const menuItems: MenuItem[] = [
  {
    id: 'meaty-lasagna',
    name: 'Meaty Lasagna',
    description: 'Rich, layered lasagna loaded with seasoned meat and melted cheese, served with your choice of salad.',
    price: 20,
    category: 'entree',
    image: '/images/menu-meaty-lasagna.jpg',
    available: true,
    featured: true,
    customizations: [
      {
        type: 'salad-choice',
        label: 'Choice of Salad',
        options: SALAD_OPTIONS,
        min: 1,
        max: 1,
      },
    ],
  },
  {
    id: 'seafood-lasagna',
    name: 'Seafood Lasagna',
    description: 'A luxurious seafood twist on the classic, layered with shrimp, crab, and creamy sauce, paired with salad.',
    price: 25,
    category: 'entree',
    image: '/images/menu-seafood-lasagna.jpg',
    available: true,
    featured: true,
    customizations: [
      {
        type: 'salad-choice',
        label: 'Choice of Salad',
        options: SALAD_OPTIONS,
        min: 1,
        max: 1,
      },
    ],
  },
  {
    id: 'salisbury-steak',
    name: 'Salisbury Steak',
    description: 'Tender, smothered Salisbury steak with rich brown gravy and your pick of two hearty sides.',
    price: 20,
    category: 'entree',
    image: '/images/menu-salisbury-steak.jpg',
    available: true,
    featured: true,
    customizations: [
      {
        type: 'side-choice',
        label: 'Choose 2 Sides',
        options: SIDE_OPTIONS,
        min: 2,
        max: 2,
      },
    ],
  },
  {
    id: 'tuscan-salmon-shrimp',
    name: 'Tuscan Salmon & Shrimp',
    description: 'Pan-seared salmon and jumbo shrimp in a creamy Tuscan sauce with sun-dried tomatoes and spinach.',
    price: 28,
    category: 'entree',
    image: '/images/menu-tuscan-salmon.jpg',
    available: true,
    featured: true,
    customizations: [
      {
        type: 'side-choice',
        label: 'Choose 2 Sides',
        options: SIDE_OPTIONS,
        min: 2,
        max: 2,
      },
    ],
  },
  {
    id: 'shrimp-deviled-eggs',
    name: 'Shrimp Deviled Eggs',
    description: 'Classic deviled eggs topped with seasoned shrimp — sold in sets of 4.',
    price: 5,
    category: 'appetizer',
    image: '/images/menu-shrimp-deviled-eggs.jpg',
    available: true,
    featured: false,
    unitLabel: '4 for $5',
    customizations: [],
  },
  {
    id: 'regular-deviled-eggs',
    name: 'Regular Deviled Eggs',
    description: 'Creamy, tangy deviled eggs with a hint of paprika — sold in sets of 4.',
    price: 3,
    category: 'appetizer',
    image: '/images/menu-deviled-eggs.jpg',
    available: true,
    featured: false,
    unitLabel: '4 for $3',
    customizations: [],
  },
  {
    id: 'herbal-garlic-mash',
    name: 'Herbal Garlic Mash Potatoes',
    description: 'Creamy mashed potatoes with fresh herbs and roasted garlic.',
    price: 6,
    category: 'side',
    image: '/images/menu-mash-potatoes.jpg',
    available: true,
    featured: false,
    customizations: [],
  },
  {
    id: 'chef-rice',
    name: 'Chef Rice',
    description: 'Seasoned rice prepared with the chef\'s signature blend of spices.',
    price: 5,
    category: 'side',
    image: '/images/menu-chef-rice.jpg',
    available: true,
    featured: false,
    customizations: [],
  },
  {
    id: 'string-beans',
    name: 'String Beans',
    description: 'Tender string beans sautéed with garlic and seasoning.',
    price: 5,
    category: 'side',
    image: '/images/menu-string-beans.jpg',
    available: true,
    featured: false,
    customizations: [],
  },
  {
    id: 'dessert-placeholder',
    name: 'Desserts',
    description: 'Sweet treats coming soon — stay tuned!',
    price: 0,
    category: 'dessert',
    image: '/images/menu-coming-soon.svg',
    available: false,
    featured: false,
    customizations: [],
  },
  {
    id: 'drinks-placeholder',
    name: 'Drinks',
    description: 'Refreshing beverages coming soon!',
    price: 0,
    category: 'drink',
    image: '/images/menu-coming-soon.svg',
    available: false,
    featured: false,
    customizations: [],
  },
];

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getFeaturedItems(): MenuItem[] {
  return menuItems.filter((item) => item.featured && item.available);
}

export function getItemsByCategory(category: MenuItem['category']): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export function formatCartItemLabel(item: MenuItem, selections: Record<string, string[]>): string {
  const parts = [item.name];
  for (const customization of item.customizations) {
    const selected = selections[customization.type];
    if (selected?.length) {
      const labels = selected
        .map((id) => customization.options.find((o) => o.id === id)?.label)
        .filter(Boolean);
      parts.push(labels.join(' + '));
    }
  }
  return parts.join(' — ');
}
