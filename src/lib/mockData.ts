import { FoodItem, FeedbackTag } from '../types';

export const mockFoodItems: FoodItem[] = [
  {
    id: 'f1',
    name: 'Spicy Chicken Bowl',
    description: 'Grilled chicken over brown rice with spicy mayo, edamame, and corn.',
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    price: 8.50,
  },
  {
    id: 'f2',
    name: 'Avocado Toast',
    description: 'Smashed avocado on sourdough with cherry tomatoes and microgreens.',
    category: 'Breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&q=80&w=800',
    price: 5.00,
  },
  {
    id: 'f3',
    name: 'Berry Smoothie',
    description: 'Mixed berries, greek yogurt, and honey blended to perfection.',
    category: 'Beverage',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a90a18eb?auto=format&fit=crop&q=80&w=800',
    price: 4.50,
  },
  {
    id: 'f4',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil.',
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    price: 7.00,
  }
];

export const mockTags: FeedbackTag[] = [
  { id: 't1', label: 'Too Salty' },
  { id: 't2', label: 'Perfect Portion' },
  { id: 't3', label: 'Not Fresh' },
  { id: 't4', label: 'Amazing Taste' },
  { id: 't5', label: 'Overcooked' },
  { id: 't6', label: 'Healthy' }
];
