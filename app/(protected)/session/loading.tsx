import { Flex, Spinner, Text } from '@radix-ui/themes';

export default function SessionLoadingPage() {
  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      gap="3"
      style={{ minHeight: '60vh' }}
    >
      <Spinner size="3" />
      <Text size="2" color="gray">
        Setting up your session...
      </Text>
    </Flex>
  );
}
