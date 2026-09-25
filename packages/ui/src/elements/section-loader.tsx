import { Center, type CenterProps, type SpinnerProps } from "@chakra-ui/react";
import { Loader } from "./loader";

export function SectionLoader(
  props: { spinnerProps?: SpinnerProps } & CenterProps,
) {
  const { spinnerProps, ...rest } = props;
  return (
    <Center h="25rem" p="1.125rem" rounded="lg" {...rest}>
      <Loader spinnerProps={spinnerProps} />
    </Center>
  );
}
