const { Configuration, OpenAIApi } = require("openai");

export default async function handler(req, res) {
  const configuration = new Configuration({
    apiKey: process.env["OPENAI_API_KEY"],
  });

  const openai = new OpenAIApi(configuration);

  const systemContent = `${req.body}`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      //{ role: "user", content: "consulta" },
    ],
    max_tokens: 10,
    n: 1,
    stop: null,
    temperature: 1,
    stream: true,
  });

  //res.status(200).json({ answer: response.data.choices[0].message.content });
  res.status(200).json({ answer: response.data });
  //res.pipe(response);
}
