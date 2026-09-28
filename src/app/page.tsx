"use client";

import React, { useState } from 'react';
import { FoodCatalog } from '../components/FoodCatalog/FoodCatalog';
import { FeedbackModal } from '../components/FeedbackModal/FeedbackModal';
import { FoodItem } from '../types';

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  const handleItemSelect = (item: FoodItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <main>
      <FoodCatalog onItemSelect={handleItemSelect} />
      {selectedItem && (
        <FeedbackModal item={selectedItem} onClose={closeModal} />
      )}
    </main>
  );
}
