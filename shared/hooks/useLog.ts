"use client";

type ConsoleLevel = "log" | "info" | "warn" | "error" | "debug" | "trace";

type UseConsoleOptions = {
  ns?: string; // namespace (préfixe)
  forceEnable?: boolean; // forcer ON
  forceDisable?: boolean; // forcer OFF
};

export const useLog = (options: UseConsoleOptions = {}) => {
  const { ns, forceEnable, forceDisable } = options;

  // Activation uniquement via NEXT_PUBLIC_ENABLE_LOGS === "true"
  let enabled = process.env.NEXT_PUBLIC_ENABLE_LOGS === "true";
  if (forceEnable) enabled = true;
  if (forceDisable) enabled = false;

  const prefix = ns ? `[${ns}]` : "";

  const call = (level: ConsoleLevel, args: unknown[]) => {
    if (!enabled) return;
    const fn = console[level] as (...a: unknown[]) => void;
    if (!fn) return;
    if (prefix) fn(prefix, ...args);
    else fn(...args);
  };

  const log = (...args: unknown[]) => call("log", args);
  const info = (...args: unknown[]) => call("info", args);
  const warn = (...args: unknown[]) => call("warn", args);
  const error = (...args: unknown[]) => call("error", args);
  const debug = (...args: unknown[]) => call("debug", args);
  const trace = (...args: unknown[]) => call("trace", args);

  const group = (...args: unknown[]) => call("log", ["[group]", ...args]);
  const groupCollapsed = (...args: unknown[]) =>
    call("log", ["[groupCollapsed]", ...args]);
  const groupEnd = () => {
    if (!enabled || !console.groupEnd) return;
    console.groupEnd();
  };

  const table = (data?: unknown, columns?: readonly string[]) => {
    if (!enabled) return;
    try {
      const c = console as unknown as {
        table?: (data?: unknown, columns?: readonly string[]) => void;
      };
      c.table?.(data, columns);
    } catch {}
  };

  const time = (label?: string) => {
    if (!enabled || !console.time) return;
    console.time(label);
  };

  const timeEnd = (label?: string) => {
    if (!enabled || !console.timeEnd) return;
    console.timeEnd(label);
  };

  return {
    enabled,
    log,
    info,
    warn,
    error,
    debug,
    trace,
    group,
    groupCollapsed,
    groupEnd,
    table,
    time,
    timeEnd,
  } as const;
};
