import { OpenAI } from "gpt-x";

// new OpenAI(apikey: string, organization?: string, version?: string)
const openai = new OpenAI(process.env.OPENAI_API_KEY, "my-organization");

export default async (req, res) => {
  const stream = await openai.completeAndStream("gpt-4", {
    // or completeFromModelAndStream
    prompt: "Q: Hello\nA:",
    user: "user-123",
  });

  stream.pipe(response);
  //res.pipe(stream);
};
