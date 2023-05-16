import { useCallback, useMemo, useState } from "react";
import useApi, { IRequestParams } from "./useApi.ts";
import qs from "qs";

interface IUsePayloadCollectionProps {
  collection: string;
  fetchOnInit?: boolean;
  perPageLimit?: number;
  clearOnStart?: boolean;
  depth?: number;
  expand?: any;
  query?: any;
}

function usePayloadCollection({
  collection,
  fetchOnInit = true,
  perPageLimit = 0,
  depth = 1,
  clearOnStart,
  expand,
  query,
}: IUsePayloadCollectionProps) {
  const prodUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://192.168.1.11:3020/api";
  const baseUrl = process.env.NODE_ENV === "development" ? localUrl : prodUrl;
  const [findQuery, setFindQuery] = useState<string>("");

  const buildQueryString = useCallback((query) => {
    if (!query) return "";
    const queryString = qs.stringify({ where: query });
    return `&${queryString}`;
  }, []);

  const apiUrl = `${baseUrl}/${collection}?limit=${perPageLimit}&depth=${depth}`;

  const {
    data,
    request: fetchAll,
    response,
    loading: fetchAllLoading,
    error: fetchAllError,
    arrayData,
  } = useApi(`${apiUrl}${buildQueryString(query)}`, {
    method: "GET",
    fetchOnInit,
    perPageLimit,
    clearOnStart,
    expand,
  });

  const {
    request: findByQuery,
    data: queryResults,
    loading: findByQueryLoading,
    error: findByQueryError,
    arrayData: arrayQueryResults,
  } = useApi(apiUrl, {
    method: "GET",
    perPageLimit,
    clearOnStart,
    expand,
  });

  const findByQueryHandler = async (query: any) => {
    return await findByQuery({ query: buildQueryString(query) });
  };

  const {
    request: create,
    response: createResponse,
    loading: createLoading,
    error: createError,
  } = useApi(`${baseUrl}/${collection}`, {
    method: "POST",
  });

  const {
    request: update,
    response: updateResponse,
    loading: updating,
    error: updateError,
  } = useApi(`${baseUrl}/${collection}/:id`, {
    method: "PUT",
  });

  const {
    request: deleteItem,
    response: deleteResponse,
    loading: deleteLoading,
    error: deleteError,
  } = useApi(`${baseUrl}/${collection}/:id`, {
    method: "DELETE",
  });

  const fetchSingle = useCallback(
    async (itemId) => {
      const {
        data: singleData,
        request: fetchSingleApi,
        response: fetchSingleResponse,
        loading: fetchSingleLoading,
        error: fetchSingleError,
      } = useApi(`${apiUrl}/${itemId}`, {
        method: "GET",
      });

      await fetchSingleApi();
      return {
        data: singleData,
        response: fetchSingleResponse,
        loading: fetchSingleLoading,
        error: fetchSingleError,
      };
    },
    [apiUrl]
  );

  const fields = useMemo(() => {
    if (arrayData.length > 0) {
      return Object.keys(arrayData[0]);
    }
    return [];
  }, [arrayData]);

  return {
    fetchAllData: data,
    queryResults,
    findByQuery: findByQueryHandler,
    findByQueryLoading,
    findByQueryError,
    arrayQueryResults,
    fetchAll,
    fetchAllLoading,
    fetchAllError,
    create,
    createLoading,
    createError,
    update,
    updating,
    updateError,
    deleteItem,
    deleteLoading,
    deleteError,
    fetchSingle,
    response,
    arrayData: arrayData[0] || [],
    fields,
  };
}

export default usePayloadCollection;
