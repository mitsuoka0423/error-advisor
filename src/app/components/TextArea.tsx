import { useState, ChangeEventHandler } from "react";
import { Box, Text, Textarea } from "@chakra-ui/react";

interface TextAreaProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
}

export const TextArea = ({ label, value, setValue }: TextAreaProps) => {
  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <Box>
      <Text mb="8px">{label}</Text>
      <Textarea value={value} onChange={handleInputChange} height="300px" />
    </Box>
  );
};
