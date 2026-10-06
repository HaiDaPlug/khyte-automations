import Image from "next/image";
import { SAJT } from "@/kompass/data/kompass";
import { tillgang } from "@/kompass/konfig";

/**
 * Mörk pillerformad header med Khytes logga, som på sajten.
 * Loggan är vit och behöver därför den mörka ytan bakom sig.
 */
export default function Header() {
  return (
    <header className="flex justify-center px-4 pt-5 pb-2">
      <a
        href={SAJT.bas}
        className="inline-flex items-center rounded-full bg-[var(--k-dark)] px-7 py-3.5 transition-opacity hover:opacity-85"
      >
        <Image
          src={tillgang("khyte-logo-text.png")}
          alt="Khyte Automations — till startsidan"
          width={480}
          height={224}
          priority
          className="h-7 w-auto sm:h-8"
        />
      </a>
    </header>
  );
}
