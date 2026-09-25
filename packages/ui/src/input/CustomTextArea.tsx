import { Field, Textarea } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { CustomTextareaProps } from "../types/input";

export const CustomTextArea = forwardRef<
  HTMLTextAreaElement,
  CustomTextareaProps
>(function CustomTextArea(
  {
    label,
    placeholder,
    helperText,
    required = false,
    disabled = false,
    error,
    rows = 4,
    textAreaProps,
    fieldRootProps,
    fieldLabelProps,
    fieldErrorTextProps,
    fieldHelperTextProps,
    value,
    onChange,
    onBlur,
    name,
  },
  ref,
) {
  return (
    <Field.Root
      gap={0}
      required={required}
      invalid={!!error}
      disabled={disabled}
      {...fieldRootProps}
    >
      {label && (
        <Field.Label
          mb="0.5rem"
          textStyle="tiny-semibold"
          color="field.label"
          {...fieldLabelProps}
        >
          {label}
          {required && <Field.RequiredIndicator color="field.required" />}
        </Field.Label>
      )}
      <Textarea
        ref={ref}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...textAreaProps}
      />
      {error && (
        <Field.ErrorText
          mt="0.25rem"
          textStyle="tiny-regular"
          {...fieldErrorTextProps}
        >
          {error}
        </Field.ErrorText>
      )}
      {helperText && !error && (
        <Field.HelperText
          mt="0.25rem"
          textStyle="tiny-regular"
          color="gray.200"
          {...fieldHelperTextProps}
        >
          {helperText}
        </Field.HelperText>
      )}
    </Field.Root>
  );
});
