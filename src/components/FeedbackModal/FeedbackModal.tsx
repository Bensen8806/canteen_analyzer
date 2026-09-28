import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { FoodItem, FeedbackPayload } from '../../types';
import { mockTags } from '../../lib/mockData';
import styles from './FeedbackModal.module.css';

interface FeedbackModalProps {
  item: FoodItem;
  onClose: () => void;
}

export function FeedbackModal({ item, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comments, setComments] = useState('');

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    // In Phase 4, this payload will be sent to an AI service
    const payload: FeedbackPayload = {
      itemId: item.id,
      rating,
      tags: selectedTags,
      comments,
      timestamp: new Date().toISOString(),
    };
    console.log('Feedback submitted:', payload);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <h2>Feedback for {item.name}</h2>
            <p>Tell us what you think to improve the menu!</p>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className={styles.body}>
          <div>
            <h3 className={styles.sectionTitle}>Rate your meal</h3>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`${styles.starBtn} ${(hoverRating || rating) >= star ? styles.active : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} stars`}
                >
                  <Star size={32} fill={(hoverRating || rating) >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Quick Tags</h3>
            <div className={styles.tags}>
              {mockTags.map(tag => (
                <button
                  key={tag.id}
                  className={`${styles.tagBtn} ${selectedTags.includes(tag.id) ? styles.selected : ''}`}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Detailed Comments (Optional)</h3>
            <textarea 
              className={styles.textarea}
              placeholder="What specifically did you like or dislike?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        <footer className={styles.footer}>
          <button 
            className={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={rating === 0}
            style={{ opacity: rating === 0 ? 0.5 : 1, cursor: rating === 0 ? 'not-allowed' : 'pointer' }}
          >
            <Send size={18} />
            <span>Submit Feedback</span>
          </button>
        </footer>

      </div>
    </div>
  );
}
