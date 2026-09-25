import type { IAlertDispatch } from "@repo/types";
import { toaster } from "@repo/ui/elements";

/** The registrar's feedback loop: every action says who it reached. */
export function announceAlert(
  alert: IAlertDispatch | null | undefined,
  title = "Posted",
) {
  if (!alert) {
    toaster.create({ type: "success", title });
    return;
  }
  toaster.create({
    type: "success",
    title: `${title} · ${alert.recipients.toLocaleString()} counsel alerted`,
    description: `${alert.sms.toLocaleString()} SMS · ${alert.whatsapp.toLocaleString()} WhatsApp`,
  });
}
