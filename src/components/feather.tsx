import Image from "next/image";

/**
 * The peacock feather, drawn rather than downloaded.
 *
 * It carries the Krishna mark everywhere the photograph is too heavy or too
 * detailed to read: a 16px icon in a chat bubble, a cursor, an empty state. As
 * an inline SVG it inherits `currentColor`, so it takes the spectrum colour of
 * whatever it sits on instead of fighting it.
 */
export function Feather({ className }: { className?: string }) {
  return (
    <Image
      src="/krishna/feather-cursor.png"
      alt=""
      width={300}
      height={300}
      aria-hidden
      className={`${className} h-9 w-auto`}
    />
  );
}
