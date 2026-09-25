import { Field, NativeSelect } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { CustomSelectProps } from "../types/input";

/**
 * Native `<select>` on purpose: the registrar portal targets low-end phone
 * browsers where the OS picker is faster and more accessible than a custom
 * popover. Swap for Chakra's `Select` where search is needed.
 */
export const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
  function CustomSelect(
    {
      label,
      placeholder,
      helperText,
      required = false,
      disabled = false,
      error,
      options,
      selectProps,
      fieldRootProps,
      fieldLabelProps,
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
        <NativeSelect.Root size="md" h="3rem">
          <NativeSelect.Field
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            h="3rem"
            {...selectProps}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        {error && (
          <Field.ErrorText mt="0.25rem" textStyle="tiny-regular">
            {error}
          </Field.ErrorText>
        )}
        {helperText && !error && (
          <Field.HelperText
            mt="0.25rem"
            textStyle="tiny-regular"
            color="gray.200"
          >
            {helperText}
          </Field.HelperText>
        )}
      </Field.Root>
    );
  },
);
