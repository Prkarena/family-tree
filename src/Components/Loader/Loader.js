import { Box, Center, Spinner, VStack } from "@chakra-ui/react";

const Loader = () => {
  return (
    <VStack w="full" h="full" position="fixed" top={0} left={0} zIndex={9999}>
      <Center h="full">
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
        />
      </Center>
      {/* Overlay element */}
      <Box
        w="full"
        h="full"
        position="absolute"
        top={0}
        left={0}
        bg="black"
        opacity={0.3}
        pointerEvents="none" // Prevent clicks on the overlay
      />
    </VStack>
  );
};

export default Loader;
