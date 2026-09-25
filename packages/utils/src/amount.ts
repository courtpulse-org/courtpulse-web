/** Escrow fees and Pulse Credits are in Naira; amounts travel as kobo. */
export function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

export function nairaToKobo(naira: number) {
  return Math.round(naira * 100);
}
