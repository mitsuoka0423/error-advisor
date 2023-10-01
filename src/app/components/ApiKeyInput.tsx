import { useState } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from "@chakra-ui/react";

interface TextAreaProps {
  value: string;
  setValue: (value: string) => void;
}

export const ApiKeyInput = ({ value, setValue }: TextAreaProps) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Box>
      <Text mb="8px">
        APIキー (APIキーは
        <Link
          href="https://platform.openai.com/account/api-keys"
          color="teal.500"
          isExternal
        >
          ここ
        </Link>
        から発行できます)
      </Text>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="sk-****************"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};
