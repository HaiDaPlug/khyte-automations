import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  children: ReactNode;
  href?: string;
  className?: string;
}

export default function Button({
  variant,
  children,
  href,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-block px-8 py-4 rounded-[4px] text-[15px] font-medium transition-all duration-200 cursor-pointer";

  const variantStyles = {
    primary:
      "bg-[var(--color-accent)] text-[var(--color-bg)] border border-[var(--color-accent)] hover:bg-[#ccc] hover:border-[#ccc]",
    secondary:
      "bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-text)]",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return <button className={combinedClassName}>{children}</button>;
}
