import { Field, HStack, PinInput } from "@chakra-ui/react";

interface OtpInputProps {
  label?: string;
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

/** Phone OTP entry (PRD §2 — lawyers self-register with enrolment no. + OTP). */
export function OtpInput({
  label,
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  disabled,
}: OtpInputProps) {
  return (
    <Field.Root invalid={!!error} disabled={disabled}>
      {label && (
        <Field.Label mb="0.5rem" textStyle="tiny-semibold" color="field.label">
          {label}
        </Field.Label>
      )}
      <PinInput.Root
        count={length}
        otp
        value={value}
        onValueChange={(d) => onChange(d.value)}
        onValueComplete={(d) => onComplete?.(d.valueAsString)}
        size="lg"
      >
        <PinInput.HiddenInput />
        <PinInput.Control asChild>
          <HStack gap="2">
            {Array.from({ length }).map((_, i) => (
              <PinInput.Input
                key={i}
                index={i}
                textStyle="mono"
                fontSize="lg"
                h="3.25rem"
                w="2.75rem"
              />
            ))}
          </HStack>
        </PinInput.Control>
      </PinInput.Root>
      {error && (
        <Field.ErrorText mt="0.25rem" textStyle="tiny-regular">
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
}
