import React from 'react';
import { FoodCard } from '../FoodCard/FoodCard';
import { mockFoodItems } from '../../lib/mockData';
import { FoodItem } from '../../types';
import styles from './FoodCatalog.module.css';

interface FoodCatalogProps {
  onItemSelect: (item: FoodItem) => void;
}

export function FoodCatalog({ onItemSelect }: FoodCatalogProps) {
  return (
    <section className={styles.catalogSection}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className="premium-gradient-text">Canteen</span> Menu
        </h1>
        <p className={styles.subtitle}>
          Discover our fresh daily offerings and tell us what you think. Your feedback shapes tomorrow's menu.
        </p>
      </header>
      <div className={styles.grid}>
        {mockFoodItems.map((item) => (
          <FoodCard key={item.id} item={item} onClick={onItemSelect} />
        ))}
      </div>
    </section>
  );
}
