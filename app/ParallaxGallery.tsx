'use client'

import React, { useState, useEffect } from 'react';
import Image from "next/image";

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
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // 容器尺寸监听
  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById('gallery-container');
      if (container) {
        setContainerSize({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (containerSize.width === 0) return;

    const aspectRatio = containerSize.width / containerSize.height;
    const cardSize: CardSize = { 
      width: Math.min(25, 90 / Math.ceil(Math.sqrt(12 * aspectRatio))), // 动态计算合适的卡片大小
      height: Math.min(25, 90 / Math.ceil(Math.sqrt(12 / aspectRatio)))
    };
    const margin: number = cardSize.width * 0.2; // 间距为卡片宽度的20%
    const numCards: number = 12;

    // 计算可用区域范围（考虑边距和卡片大小）
    const safeArea = {
      minX: cardSize.width / 2 + 5,
      maxX: 95 - cardSize.width / 2,
      minY: cardSize.height / 2 + 5,
      maxY: 95 - cardSize.height / 2
    };
    
    const isOverlapping = (newPos: CardPosition, existingCards: Card[]): boolean => {
      return existingCards.some(card => {
        const xOverlap = Math.abs(newPos.x - card.x) < (cardSize.width + margin);
        const yOverlap = Math.abs(newPos.y - card.y) < (cardSize.height + margin);
        return xOverlap && yOverlap;
      });
    };

    const findValidPosition = (existingCards: Card[]): CardPosition | null => {
      let attempts = 0;
      const maxAttempts = 100;
      
      while (attempts < maxAttempts) {
        const x = safeArea.minX + Math.random() * (safeArea.maxX - safeArea.minX);
        const y = safeArea.minY + Math.random() * (safeArea.maxY - safeArea.minY);
        
        if (!isOverlapping({ x, y }, existingCards)) {
          return { x, y };
        }
        attempts++;
      }
      return null;
    };

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
  }, [containerSize]);

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
    <div 
      id="gallery-container"
      className="relative w-full h-screen bg-white overflow-hidden p-8"
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="absolute w-64 h-64 transition-transform duration-200 ease-out"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            transform: `translate(-50%, -50%) translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
          }}
        >
          <div 
            className="w-full h-full rounded-lg p-1 hover:scale-150 transition-transform shadow-lg"
            style={{
              backdropFilter: 'blur(8px)'
            }}
          >
            <Image
              src={`/images/${index}.webp`}
              alt={`Card ${card.id}`}
              className="w-full h-full object-cover rounded-lg"
              width={248}
              height={248}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParallaxGallery;

