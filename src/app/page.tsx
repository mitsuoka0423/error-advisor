"use client";

import { useState } from "react";
import { Box, Button, ChakraProvider, Heading, Progress } from "@chakra-ui/react";

import { ApiKeyInput } from "./components/ApiKeyInput";
import { TextArea } from "./components/TextArea";

const ENDPOINT_CHAT_COMPLETION = "https://api.openai.com/v1/chat/completions";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [advice, setAdvice] = useState("");
  const [adviceCode, setAdviceCode] = useState("");
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  const handleClick = () => {
    const prompt = [`エラーメッセージ: \`\`\`${errorMessage}\`\`\``];
    const required = ["errorCauseAndCorrectiveAction"];
    if (code) {
      prompt.push(`コード: \`\`\`${code}\`\`\``);
      required.push("modifiedCode");
    }

    setIsIndeterminate(true);
    fetch(ENDPOINT_CHAT_COMPLETION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "ソフトウェアエンジニアとして下記エラーの原因と対応策を日本語で答えてください",
          },
          { role: "user", content: prompt.join("\n") },
        ],
        model: "gpt-3.5-turbo",
        functions: [
          {
            name: "getAdvice",
            description: "Get error cause, corrective action and modified code",
            parameters: {
              type: "object",
              properties: {
                errorCauseAndCorrectiveAction: {
                  type: "string",
                  description:
                    "Briefly describe the cause of the error and the corrective action",
                },
                modifiedCode: {
                  type: "string",
                  description: "Modified code",
                },
              },
              required,
            },
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const advice = JSON.parse(
          data.choices[0].message.function_call.arguments
        );
        setAdvice(advice.errorCauseAndCorrectiveAction);
        setAdviceCode(advice.modifiedCode);
        setIsIndeterminate(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <ChakraProvider>
      <header>
        <Box bg="#D9D9D9" width="100%" height="64px" display="flex" alignItems="center" paddingLeft="24px">
          <Heading as="h1">コードのエラーをChatGPTに聞く</Heading>
        </Box>
      </header>
      <Progress size='xs' isIndeterminate={isIndeterminate} />
      <main>
        <Box display="flex" flexDirection="row" columnGap="24px" margin="24px">
          <Box flexGrow="1" display="flex" flexDirection="column" rowGap="24px">
            <TextArea
              label="エラーメッセージ"
              value={errorMessage}
              setValue={setErrorMessage}
            />
            <TextArea label="コード" value={code} setValue={setCode} />
            <ApiKeyInput
              value={apiKey}
              setValue={setApiKey}
            />
            <Button
              colorScheme="blue"
              onClick={handleClick}
            >
              ChatGPTに聞く
            </Button>
          </Box>
          <Box flexGrow="1" display="flex" flexDirection="column" rowGap="24px">
            <TextArea label="アドバイス" value={advice} setValue={setAdvice} />
            <TextArea
              label="修正案"
              value={adviceCode}
              setValue={setAdviceCode}
            />
          </Box>
        </Box>
      </main>
    </ChakraProvider>
  );
}
