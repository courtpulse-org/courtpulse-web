import { CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

/** Centered on desktop, a bottom sheet on phones. */
export function AppDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: AppDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      size={size}
      placement={{ base: "bottom", md: "center" }}
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            roundedBottom={{ base: "none", md: "lg" }}
            rounded="lg"
            mx={{ base: 0, md: 4 }}
            mb={{ base: 0, md: "auto" }}
          >
            <Dialog.Header
              flexDirection="column"
              alignItems="flex-start"
              gap="1"
              pb="2"
            >
              <Dialog.Title textStyle="h3">{title}</Dialog.Title>
              {description && (
                <Text textStyle="small-regular" color="gray.200">
                  {description}
                </Text>
              )}
            </Dialog.Header>
            <Dialog.Body>{children}</Dialog.Body>
            {footer && (
              <Dialog.Footer borderTop="1px solid" borderColor="gray.75" pt="4">
                {footer}
              </Dialog.Footer>
            )}
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
