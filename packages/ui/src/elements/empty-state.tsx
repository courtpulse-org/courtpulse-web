import {
  Button,
  ButtonGroup,
  EmptyState,
  VStack,
  type EmptyStateRootProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  buttonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  /** `page` fills the viewport; `inline` sits inside a card or tab. */
  size?: "page" | "inline";
}

export function EmptyStateComponent({
  title = "Nothing here yet",
  description = "There's nothing to show here yet.",
  icon,
  buttonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  size = "page",
  ...props
}: EmptyStateProps & EmptyStateRootProps) {
  const inline = size === "inline";
  return (
    <EmptyState.Root
      {...props}
      h={inline ? "auto" : "60vh"}
      py={inline ? "3rem" : undefined}
      px={inline ? "1.25rem" : undefined}
      bg={inline ? "gray.25" : undefined}
      borderWidth={inline ? "1px" : undefined}
      borderStyle={inline ? "dashed" : undefined}
      borderColor={inline ? "gray.75" : undefined}
      borderRadius={inline ? "lg" : undefined}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <EmptyState.Content>
        {icon && (
          <EmptyState.Indicator color="gray.100">{icon}</EmptyState.Indicator>
        )}
        <VStack textAlign="center">
          <EmptyState.Title textStyle="h4">{title}</EmptyState.Title>
          <EmptyState.Description color="gray.200">
            {description}
          </EmptyState.Description>
        </VStack>
        {(buttonText || secondaryButtonText) && (
          <ButtonGroup mt={4}>
            {buttonText && (
              <Button onClick={onPrimaryClick}>{buttonText}</Button>
            )}
            {secondaryButtonText && (
              <Button variant="outline" onClick={onSecondaryClick}>
                {secondaryButtonText}
              </Button>
            )}
          </ButtonGroup>
        )}
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
