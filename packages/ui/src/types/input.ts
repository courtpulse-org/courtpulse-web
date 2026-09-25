import type {
  FieldErrorTextProps,
  FieldHelperTextProps,
  FieldLabelProps,
  FieldRequiredIndicatorProps,
  FieldRootProps,
  InputProps,
  TextareaProps,
  NativeSelectFieldProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface BaseFieldProps {
  label?: string | ReactNode;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | undefined;
  value?: any;
  onChange?: any;
  onBlur?: any;
  name?: string;
  fieldRootProps?: FieldRootProps;
  fieldLabelProps?: FieldLabelProps;
  fieldHelperTextProps?: FieldHelperTextProps;
  fieldErrorTextProps?: FieldErrorTextProps;
  fieldRequiredIndicatorProps?: FieldRequiredIndicatorProps;
}

export interface CustomInputProps extends BaseFieldProps {
  type?:
    "text" | "email" | "password" | "tel" | "url" | "date" | "time" | "number";
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  inputProps?: InputProps;
}

export interface CustomTextareaProps extends BaseFieldProps {
  rows?: number;
  textAreaProps?: TextareaProps;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CustomSelectProps extends BaseFieldProps {
  options: SelectOption[];
  selectProps?: NativeSelectFieldProps;
}
