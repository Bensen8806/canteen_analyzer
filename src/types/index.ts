export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price: number;
}

export interface FeedbackTag {
  id: string;
  label: string;
}

export interface FeedbackPayload {
  itemId: string;
  rating: number;
  tags: string[];
  comments: string;
  timestamp: string;
}
