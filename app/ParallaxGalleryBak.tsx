'use client'

import React, { useState, useEffect } from 'react';

interface CardPosition {
  x: number;
  y: number;
}

interface Card extends CardPosition {
  id: number;
}

interface CardSize {
  width: number;
  height: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const ParallaxGallery: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const cardSize: CardSize = { width: 15, height: 15 }; // 卡片大小（百分比）
    const margin: number = 5; // 最小间距（百分比）
    const numCards: number = 12;
    
    // 检查位置是否与已有卡片重叠
    const isOverlapping = (newPos: CardPosition, existingCards: Card[]): boolean => {
      return existingCards.some(card => {
        const xOverlap = Math.abs(newPos.x - card.x) < (cardSize.width + margin);
        const yOverlap = Math.abs(newPos.y - card.y) < (cardSize.height + margin);
        return xOverlap && yOverlap;
      });
    };

    // 寻找有效的随机位置
    const findValidPosition = (existingCards: Card[]): CardPosition | null => {
      let attempts = 0;
      const maxAttempts = 100;
      
      while (attempts < maxAttempts) {
        const x = cardSize.width/2 + Math.random() * (100 - cardSize.width);
        const y = cardSize.height/2 + Math.random() * (100 - cardSize.height);
        
        if (!isOverlapping({ x, y }, existingCards)) {
          return { x, y };
        }
        attempts++;
      }
      return null;
    };

    // 生成所有卡片的位置
    const generateCards = (): Card[] => {
      const newCards: Card[] = [];
      
      for (let i = 0; i < numCards; i++) {
        const position = findValidPosition(newCards);
        if (position) {
          newCards.push({
            id: i,
            x: position.x,
            y: position.y
          });
        }
      }
      
      return newCards;
    };

    setCards(generateCards());
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden p-8">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="absolute w-32 h-32 transition-transform duration-500 ease-out"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            transform: `translate(-50%, -50%) translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
          }}
        >
          <div 
            className="w-full h-full rounded-lg p-0.5 transition-transform shadow-lg hover:scale-150"
            style={{
              backdropFilter: 'blur(8px)'
            }}
          >
            <img
              src={`/images/${index}.webp`}
              alt={`Card ${card.id}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParallaxGallery;
