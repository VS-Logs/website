import React from "react";
import { Stack, Heading, Text } from "@chakra-ui/react";

const Home = () => (
  <Stack direction="column" spacing="20px">
    <Heading
      color="#101010"
      as="h1"
      fontSize="clamp(2em, 2em + 2vw, 3em)"
      letterSpacing="-0.03em"
      textAlign="start"
    >
      Leonardo Maldonado
    </Heading>

    <Text width="100%" fontSize="18px" lineHeight="30px">
      I work with powerful technologies to help companies succeed.
      <br />
      <br />I mostly work with <strong>JavaScript</strong> and technologies
      related to it such as{" "}
      <strong>
        React, Next.js, Node.js, TypeScript, GraphQL, MongoDB, etc.
      </strong>
      <br />
      <br />I{" "}
      <strong>
        created an open-source project considered by GitHub one of the top
        projects of 2018.
      </strong>
      <br />
      <br />
      <strong>Writing</strong> for two different websites{" "}
      <strong>monthly articles</strong> related to JavaScript and technologies
      around it.
      <br />
      <br />
      I’m always willing to have <strong>new challenges</strong> and{" "}
      <strong>learn something new.</strong>
    </Text>
  </Stack>
);

export default Home;
