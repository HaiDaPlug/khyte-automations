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
    "inline-flex h-12 px-8 rounded-md text-base font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer items-center justify-center active:scale-[0.98] no-underline";

  const variantStyles = {
    primary: "bg-[#D4622B] text-white hover:bg-[#C0541F]",
    secondary:
      "bg-transparent border border-[rgba(58,51,48,0.20)] text-[#3A3330] hover:bg-[rgba(58,51,48,0.06)]",
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
