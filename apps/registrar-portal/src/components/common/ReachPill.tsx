import { Flex, Text, type FlexProps } from "@chakra-ui/react";
import { MessageIcon, SmsIcon, UsersIcon } from "@repo/ui/icons";

interface ReachPillProps extends FlexProps {
  recipients: number;
  sms?: number;
  whatsapp?: number;
  /** "will be alerted" vs "alerted". */
  future?: boolean;
  compact?: boolean;
}

/** How many counsel an action reaches, and over which channels. */
export function ReachPill({
  recipients,
  sms,
  whatsapp,
  future,
  compact,
  ...props
}: ReachPillProps) {
  return (
    <Flex
      align="center"
      gap="3"
      color="gray.300"
      textStyle="tiny-medium"
      wrap="wrap"
      {...props}
    >
      <Flex align="center" gap="1.5">
        <UsersIcon color="primary.300" />
        <Text>
          <Text as="span" fontWeight="700" color="gray.500">
            {recipients.toLocaleString()}
          </Text>{" "}
          counsel {future ? "will be alerted" : "alerted"}
        </Text>
      </Flex>
      {!compact && sms != null && (
        <Flex align="center" gap="1">
          <SmsIcon />
          <Text>{sms.toLocaleString()} SMS</Text>
        </Flex>
      )}
      {!compact && whatsapp != null && (
        <Flex align="center" gap="1" color="success.400">
          <MessageIcon />
          <Text>{whatsapp.toLocaleString()} WhatsApp</Text>
        </Flex>
      )}
    </Flex>
  );
}
