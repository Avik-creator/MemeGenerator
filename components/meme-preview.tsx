"use client"

import React, { Ref, useState } from 'react';
import { motion } from 'framer-motion';
import { text } from '@/types/text';

interface MemePreviewPropsType {
  image: string | null;
  memeRef: Ref<HTMLDivElement> | null;
  text: text;
  setText: React.Dispatch<React.SetStateAction<text>>;
}

const MemePreview = ({
  image,
  memeRef,
  text,
  setText,
}: MemePreviewPropsType) => {
  const [isDragging, setIsDragging] = useState(false);
  const guideXPercent = 50;
  const guideYPercent = 50;

  const handleDragEnd = (type: "top" | "bottom", event: any, info: any) => {
    if (!memeRef || !('current' in memeRef) || !memeRef.current) return;
    
    const container = memeRef.current;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    if (type === "top") {
      setText(prev => ({
        ...prev,
        topPosXPercent: xPercent,
        topPosYPercent: yPercent
      }));
    } else {
      setText(prev => ({
        ...prev,
        bottomPosXPercent: xPercent,
        bottomPosYPercent: yPercent
      }));
    }
    setIsDragging(false);
  };

  return (
    <div className="lg:w-3/5 w-full">
      <h2 className="md:text-sm text-xs">Your Meme Preview</h2>
      <div className={`w-full border border-neutral-700 lg:h-[30rem] md:h-[26rem] h-80 rounded-xl mt-2 overflow-hidden`}>
        {image && (
          <div
            ref={memeRef}
            className="relative w-full h-full"
          >
            <img
              src={image}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
            />

            {isDragging && (
              <>
                <div
                  className="absolute top-0 bottom-0 w-px bg-yellow-400 pointer-events-none"
                  style={{ left: `${guideXPercent}%` }}
                />
                <div
                  className="absolute left-0 right-0 h-px bg-yellow-400 pointer-events-none"
                  style={{ top: `${guideYPercent}%` }}
                />
              </>
            )}

            {/* Top Text */}
            {text.topText && (
              <motion.div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center cursor-move"
                drag
                dragMomentum={false}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(event, info) => handleDragEnd("top", event, info)}
                style={{
                  letterSpacing: `${text.topLetterSpacing}px`,
                  opacity: `${text.topTextOpacity}%`,
                  color: text.topTextColor,
                  WebkitTextStroke: `${text.topStrokeWidth}px ${text.topStrokeColor}`,
                  fontSize: text.topTextFontSize,
                  fontWeight: 'bold',
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  wordBreak: "keep-all",
                  overflowWrap: "normal",
                  width: "90%",
                  left: `${text.topPosXPercent}%`,
                  top: `${text.topPosYPercent}%`
                }}
              >
                {text.topText}
              </motion.div>
            )}

            {/* Bottom Text */}
            {text.bottomText && (
              <motion.div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center cursor-move"
                drag
                dragMomentum={false}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(event, info) => handleDragEnd("bottom", event, info)}
                style={{
                  letterSpacing: `${text.bottomLetterSpacing}px`,
                  opacity: `${text.bottomTextOpacity}%`,
                  color: text.bottomTextColor,
                  WebkitTextStroke: `${text.bottomStrokeWidth}px ${text.bottomStrokeColor}`,
                  fontSize: text.bottomTextFontSize,
                  fontWeight: 'bold',
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  wordBreak: "keep-all",
                  overflowWrap: "normal",
                  width: "90%",
                  left: `${text.bottomPosXPercent}%`,
                  top: `${text.bottomPosYPercent}%`
                }}
              >
                {text.bottomText}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MemePreview

