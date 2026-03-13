import React from "react";

interface CardProps {
  title: string;
  description?: string;
  type?: "creator" | "tech" | "default";
  children?: React.ReactNode;
}

export default function Card({
  title,
  description,
  type = "default",
  children,
}: CardProps) {
  const cardClass =
    type === "creator"
      ? "card creator-card"
      : type === "tech"
        ? "card tech-card"
        : "card";

  return (
    <div className={cardClass}>
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{ __html: description }}></p>
      {children}
    </div>
  );
}
