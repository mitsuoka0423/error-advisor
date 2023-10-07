"use client";

import { useState } from "react";
import {
  Box,
  Button,
  ChakraProvider,
  Heading,
  Progress,
} from "@chakra-ui/react";

import { TextArea } from "./components/TextArea";
import { ConversationResponseType } from "@/interfaces/conversation";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState("");
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
    fetch("/api/conversation", {
      method: "POST",
      body: JSON.stringify({
        prompt: prompt.join("\n"),
      }),
    })
      .then((response) => response.json())
      .then((data: ConversationResponseType) => {
        setAdvice(data.errorCauseAndCorrectiveAction);
        setAdviceCode(data.modifiedCode || "");
        setIsIndeterminate(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <ChakraProvider>
      <header>
        <Box
          bg="#D9D9D9"
          width="100%"
          height="64px"
          display="flex"
          alignItems="center"
          paddingLeft="24px"
        >
          <Heading as="h1">ChatGPTに聞く</Heading>
        </Box>
      </header>
      <Progress size="xs" isIndeterminate={isIndeterminate} />
      <main>
        <Box display="flex" flexDirection="row" columnGap="24px" margin="24px">
          <Box flexGrow="1" display="flex" flexDirection="column" rowGap="24px">
            <TextArea
              label="コンソールに出ているエラーメッセージをそのまま貼り付けてください"
              placeholder={
                "サンプル：\nReferenceError: respnse is not defined\nat main (/home/runner/FamousExcitableInstance/index.js:5:15)\nat process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
              }
              value={errorMessage}
              setValue={setErrorMessage}
            />
            <TextArea
              label="エラーが出ているコードをそのまま貼り付けてください"
              placeholder={
                "サンプル：\nconst axios = require('axios');\n\nconst main = async () => {\n  const response = await axios('https://weather.tsukumijima.net/api/forecast/city/400040');\n  console.log(respnse);n};\nmain();"
              }
              value={code}
              setValue={setCode}
            />
            <Button colorScheme="blue" onClick={handleClick}>
              ChatGPTに聞く
            </Button>
          </Box>
          <Box flexGrow="1" display="flex" flexDirection="column" rowGap="24px">
            <TextArea
              label="ChatGPTからのアドバイス"
              value={advice}
              setValue={setAdvice}
            />
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
