import type { NextApiRequest, NextApiResponse } from "next";

import {
  ConversationRequest,
  ConversationRequestType,
  ConversationResponse,
  ConversationResponseType,
} from "@/interfaces/conversation";

const ENDPOINT_CHAT_COMPLETION = "https://api.openai.com/v1/chat/completions";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConversationResponseType>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  let body;
  try {
    body = ConversationRequest.parse(JSON.parse(req.body));
  } catch (e) {
    console.error(e);
    res.status(400);
    return;
  }

  const { prompt } = body as ConversationRequestType;
  console.log({ prompt });

  if (prompt === 'エラーメッセージ: ``````') {
    res.status(400).json({
      errorCauseAndCorrectiveAction: "エラーメッセージを入力してください",
      modifiedCode: "",
    });
    return;
  }

  const response = await fetch(ENDPOINT_CHAT_COMPLETION, {
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
            "ソフトウェアエンジニアとして下記エラーの原因と対応策を日本語で答えてください。初心者にもわかるように平易な言葉遣いをしてください",
        },
        { role: "user", content: prompt },
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
                description: "Modified whole code",
              },
            },
          },
        },
      ],
    }),
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));

  if (data.choices[0].message.content) {
    res.status(200).json({
      errorCauseAndCorrectiveAction: data.choices[0].message.content,
      modifiedCode: "",
    });
    return;
  }

  let advice;
  try {
    advice = ConversationResponse.parse(
      JSON.parse(data.choices[0].message.function_call.arguments)
    );
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
    res.status(500).json({
      errorCauseAndCorrectiveAction:
        "エラーが発生しました。申し訳ありませんが、時間を置いて再度質問してください。",
      modifiedCode: "",
    });
    return;
  }

  res.status(200).json(advice);
}
