import type { DurationType } from "@repo/types";

function getExpiresTime(payload: DurationType) {
  const now = new Date().getTime();
  switch (payload.unit) {
    case "SECOND":
      return now + 1000 * payload.value;
    case "MINUTE":
      return now + 1000 * 60 * payload.value;
    case "HOUR":
      return now + 1000 * 60 * 60 * payload.value;
    case "DAY":
      return now + 1000 * 60 * 60 * 24 * payload.value;
  }
}

export type BaseStorageKeys =
  "refresh_token" | "access_token" | "redirect_path";

/**
 * Prefixed localStorage wrapper. Each app constructs its own with a distinct
 * prefix so a lawyer session and a registrar session on the same browser
 * never read each other's tokens.
 */
export class AppStorage<TKey extends string = BaseStorageKeys> {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  getValue<T = any>(key: TKey, defaultValue?: T): T | null | undefined {
    try {
      const itemStr = window.localStorage.getItem(`${this.prefix}${key}`);
      if (!itemStr) return null;
      const item = JSON.parse(itemStr);

      // Expiry is opt-in: only enforced when the consumer set a duration.
      if (item.expiresIn != null && new Date().getTime() > item.expiresIn) {
        this.clearValue(key);
        return null;
      }
      return item.value;
    } catch {
      return defaultValue;
    }
  }

  setValue(key: TKey, value: unknown, duration?: DurationType) {
    const item = {
      value,
      ...(duration ? { expiresIn: getExpiresTime(duration) } : {}),
    };
    window.localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(item));
  }

  clearValue(key: TKey) {
    window.localStorage.removeItem(`${this.prefix}${key}`);
  }

  session = {
    getValue: <T = any>(key: TKey): T | null => {
      const raw = sessionStorage.getItem(`${this.prefix}${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    },
    setValue: (key: TKey, value: unknown) => {
      sessionStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
    },
    clearValue: (key: TKey) => {
      sessionStorage.removeItem(`${this.prefix}${key}`);
    },
  };
}
