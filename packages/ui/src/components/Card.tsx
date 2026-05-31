import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  href?: string;
}

export function Card({ children, className = "", hover = false, href }: CardProps) {
  const base = `bg-bg-card border border-border rounded-xl ${hover ? "hover:border-border-strong hover:bg-bg-elevated transition-all duration-200" : ""} ${className}`;

  if (href) {
    return (
      <a href={href} className={`block ${base}`}>
        {children}
      </a>
    );
  }

  return <div className={base}>{children}</div>;
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 pt-6 pb-4 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}
