// src/components/ui/LoadingPlaceholder.jsx
"use client";

export default function LoadingPlaceholder({ className = "", background = "#0f0f0f" }) {
  return (
    <div 
      className={`w-full h-full ${className}`} 
      style={{ backgroundColor: background }}
      aria-label="Loading..."
    />
  );
}