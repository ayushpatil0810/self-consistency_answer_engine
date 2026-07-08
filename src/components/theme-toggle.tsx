"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { RiSunLine, RiMoonLine } from "@remixicon/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to avoid layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <RiSunLine className="w-5 h-5 text-zinc-100" />
      ) : (
        <RiMoonLine className="w-5 h-5 text-zinc-900" />
      )}
    </button>
  );
}
