import { Field, Input, Box } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { CustomInputProps } from "../types/input";

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  function CustomInput(
    {
      label,
      placeholder,
      helperText,
      required = false,
      disabled = false,
      error,
      type = "text",
      leftElement,
      rightElement,
      inputProps,
      fieldRootProps,
      fieldLabelProps,
      fieldErrorTextProps,
      fieldHelperTextProps,
      fieldRequiredIndicatorProps,
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
            {required && (
              <Field.RequiredIndicator
                color="field.required"
                {...fieldRequiredIndicatorProps}
              />
            )}
          </Field.Label>
        )}
        <Box position="relative" w="100%">
          {leftElement && (
            <Box
              position="absolute"
              left="1rem"
              top="50%"
              transform="translateY(-50%)"
              zIndex={1}
              color="gray.200"
            >
              {leftElement}
            </Box>
          )}
          <Input
            ref={ref}
            name={name}
            type={type}
            placeholder={placeholder}
            pl={leftElement ? "3rem" : undefined}
            pr={rightElement ? "3rem" : undefined}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            {...inputProps}
          />
          {rightElement && (
            <Box
              position="absolute"
              right="1rem"
              top="50%"
              transform="translateY(-50%)"
              zIndex={1}
            >
              {rightElement}
            </Box>
          )}
        </Box>
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
  },
);
