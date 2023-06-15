import useLLM from "usellm";
import usePayloadCollection from "./usePayloadCollection";
const prompt = `Eres un agente encargado de analizar la relación entre diferentes piezas de texto. Recibirás los contenidos a comparar en los dos siguientes mensajes. 
- Debes responder en formato Json.
- Las claves serán intensity y keywords
- intensity será un número del 0 al 100 y representará el grado de relación entre ambos textos
- keywords será una serie de palabras clave (máximo 5) que indiquen la relación entre los textos provistos.
- Solo los resultados en json, sin explicaciones ni otros comentarios.
`;
const useBlockConnection = () => {
  const {
    fetchAllData,
    fetchAll,
    update,
    updating,
    create,
    createLoading,
    findByQuery,
  } = usePayloadCollection({
    collection: "conexiones",
  });
  const llm = useLLM({ serviceUrl: "/api/llm" });

  interface Block {
    id: string;
    content: string;
  }

  const getConnectionDataInfo = async ([block1, block2]: Block[]) => {
    //check if connection exists first...
    const exists: any = await findByQuery({
      or: [
        {
          from: {
            equals: block1.id,
          },
          and: [
            {
              to: {
                equals: block2.id,
              },
            },
          ],
        },
        {
          from: {
            equals: block2.id,
          },
          and: [
            {
              to: {
                equals: block1.id,
              },
            },
          ],
        },
      ],
    });
    console.log(exists.docs);

    if (!exists?.docs.length) {
      const { message } = await llm.chat({
        messages: [
          { role: "system", content: prompt || "" },
          { role: "user", content: block1.content },
          { role: "user", content: block2.content },
        ],
        stream: false,
        //onStream: ({ message }) => setResponse(message.content),
        //setResponse((prev) => `${prev}${message.content}`),
      });
      const conexionData = JSON.parse(message.content);
      console.log(conexionData);
      const newConnection = await create({
        body: {
          intensity: conexionData.intensity,
          keywords: conexionData.keywords.join(","),
          from: block1.id,
          to: block2.id,
        },
      });
      fetchAll();
      return newConnection;
    }
    return { error: "connection exists or error." };
  };
  return { getConnectionDataInfo, fetchAll, fetchAllData };
};

export default useBlockConnection;
