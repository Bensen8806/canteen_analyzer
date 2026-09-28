import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { FoodItem } from '../../types';
import styles from './FoodCard.module.css';

interface FoodCardProps {
  item: FoodItem;
  onClick: (item: FoodItem) => void;
}

export function FoodCard({ item, onClick }: FoodCardProps) {
  return (
    <div className={styles.card} onClick={() => onClick(item)}>
      <div className={styles.imageWrapper}>
        <img src={item.imageUrl} alt={item.name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{item.name}</h3>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
        </div>
        <span className={styles.category}>{item.category}</span>
        <p className={styles.description}>{item.description}</p>
        <button className={styles.action}>
          <MessageSquarePlus size={18} />
          <span>Leave Feedback</span>
        </button>
      </div>
    </div>
  );
}
