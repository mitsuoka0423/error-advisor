import { useState, ChangeEventHandler } from "react";
import { Box, Text, Textarea } from "@chakra-ui/react";

interface TextAreaProps {
  label: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
}

export const TextArea = ({ label, placeholder, value, setValue }: TextAreaProps) => {
  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <Box>
      <Text mb="8px">{label}</Text>
      <Textarea value={value} placeholder={placeholder} onChange={handleInputChange} height="300px" />
    </Box>
  );
};
