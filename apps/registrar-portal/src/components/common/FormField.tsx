import { Field, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

/** Lightweight label wrapper for controls that aren't CustomInput. */
export function FormField({
  label,
  hint,
  children,
  required,
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <Field.Root gap="0" required={required}>
      <Field.Label mb="2" textStyle="tiny-semibold" color="field.label">
        {label}
        {required && <Field.RequiredIndicator color="field.required" />}
      </Field.Label>
      {children}
      {hint && (
        <Text textStyle="tiny-regular" color="gray.200" mt="1">
          {hint}
        </Text>
      )}
    </Field.Root>
  );
}
