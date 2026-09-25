export type DurationUnit = "SECOND" | "MINUTE" | "HOUR" | "DAY";

export interface DurationType {
  unit: DurationUnit;
  value: number;
}
