"use client";
import { useEffect, useState } from "react";
import { THOUGHTS } from "@/lib/thoughts";
import { useApp } from "@/lib/store";

const READ_MS = 7000;
const THINK_MS = 1400;

/**
 * Krishna thinking out loud while nobody is asking.
 *
 * One line holds long enough to read, the three dots stand in for the pause
 * before the next one, and it loops. The dots are the same indicator the chat
 * uses when the model is working, so the idle bubble and a real reply are
 * visibly the same voice rather than two different widgets.
 *
 * The cycle starts on the client only, so the server and the first client
 * render agree on the opening line and React reports no mismatch.
 */
export function KrishnaThought() {
  const locale = useApp((s) => s.locale);
  const [i, setI] = useState(0);
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    const hold = setTimeout(() => setThinking(true), READ_MS);
    return () => clearTimeout(hold);
  }, [i]);

  useEffect(() => {
    if (!thinking) return;
    const think = setTimeout(() => {
      setI((n) => (n + 1) % THOUGHTS.length);
      setThinking(false);
    }, THINK_MS);
    return () => clearTimeout(think);
  }, [thinking]);

  return (
    <div
      data-krishna-thought
      className="bg-card/95 relative hidden rounded-2xl rounded-br-md border px-4 py-3 shadow-xl backdrop-blur sm:block"
    >
      {thinking ? (
        <div className="flex h-[1.05rem] items-center gap-1">
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="bg-muted-foreground/60 size-1.5 rounded-full"
              data-typing
              style={{ animationDelay: `${d * 160}ms` }}
            />
          ))}
        </div>
      ) : (
        // Keyed on the index so each new line replays the fade rather than
        // swapping its text in place.
        <p key={i} data-thought-line className="text-[12.5px] leading-relaxed">
          {THOUGHTS[i][locale]}
        </p>
      )}

      {/* the tail, drawn as a rotated square so it inherits the border */}
      <span
        aria-hidden
        className="bg-card absolute right-5 -bottom-[5px] size-2.5 rotate-45 border-r border-b"
      />
    </div>
  );
}
