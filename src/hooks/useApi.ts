import { useCallback, useEffect, useMemo, useState } from "react";
import { map } from "lodash";

export type IUseApiHandler = (requestParams?: IRequestParams) => Promise<void>;

export interface IRequestParams {
  [key: string]: any;
}
export interface IUrlParams {
  [key: string]: string | Object;
}

type useApiReturn = {
  data: any;
  arrayData: any[];
  response: any;
  loading: boolean;
  //streaming: boolean;
  error: any;
  //pagination: IPaginationParams;
  //abort: () => void;
  //next: IUseApiHandler;
  request: IUseApiHandler;
};

type apiMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
interface IUseApiProps {
  method?: apiMethods;
  subRoute?: string;
  body?: Object | undefined;
  fetchOnInit?: boolean;
  perPageLimit?: number;
  entityKey?: string;
  entityId?: number | null;
  expand?: any;
  stream?: boolean;
  urlParams?: IUrlParams;
  useBuildUrl?: boolean;
  clearOnStart?: boolean;
  startOn?: boolean;
  onStart?: () => void;
  onFinish?: () => void;
  onFail?: () => void;
  onSuccess?: (response: any) => void;
}
interface IPaginationParams {
  limit: number;
  currentPage: number;
  requestBody?: Object;
}

function useApi(
  endpoint: string,
  {
    method = "GET",
    body,
    fetchOnInit = false,
    perPageLimit = 100,
    stream = false,
    clearOnStart = true,
    startOn = false,
    onStart = () => {},
    onFinish = () => {},
    onFail = () => {},
    onSuccess = () => {},
  }: IUseApiProps = {}
): useApiReturn {
  const POST = method === "POST";
  const PUT = method === "PUT";
  const GET = method === "GET";
  const [data, setData] = useState<any>({});
  const [response, setResponse] = useState<any>();
  const [loading, setLoading] = useState<boolean>(fetchOnInit || startOn);
  const [error, setError] = useState({});
  const [pagination, setPagination] = useState<IPaginationParams>({
    limit: perPageLimit,
    currentPage: 1,
  });
  const arrayData = useMemo(() => map(data, (value) => value) ?? [], [data]);

  const doFetch = async (
    url: string = endpoint,
    urlParams: IUrlParams | IUrlParams[] = [],
    requestBody = body
  ) => {
    setLoading(true);
    setResponse(null);
    if (clearOnStart) {
      setError({});
      setData({});
    }
    onStart();
    //!isArray(urlParams) && (urlParams = [...urlParams]);
    const paramsArray = Array.isArray(urlParams) ? urlParams : [urlParams];

    const requests = paramsArray.map((param) => {
      let _url = url;
      Object.keys(param).forEach((name) => {
        const value = param[name];
        _url = _url.replace(`:${name}`, value.toString());
      });
      if (param.query) {
        _url = `${url}${param.query}`;
      }
      return fetch(_url, {
        method,
        ...(method.toLocaleLowerCase() === "post" ||
        method.toLocaleLowerCase() === "put"
          ? {
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(param.body || requestBody),
            }
          : {}),
      });
    });
    return await Promise.all(requests)
      .then(async (res) => {
        const result = [...res].length === 1 ? await res[0].json() : res;

        setResponse(result);
        setData((prevData: any) => ({
          ...(stream ? prevData : {}),
          ...result,
        }));
        onSuccess(result);
        return result;
      })
      .catch((error) => {
        setError((prevError) => ({ ...prevError, error }));
        onFail();
        setLoading(false);
      })
      .finally(() => {
        onFinish();
        setLoading(false);
      });
  };

  useEffect(() => {
    //triggers when startOn flag turns to true.
    //startOn && doFetch(endpoint, urlParams);
  }, [startOn]);

  useEffect(() => {
    //fetch on init and changes in url.
    !!fetchOnInit && request();
  }, [fetchOnInit, endpoint]);

  const request = useCallback(
    //callback for triggering fetch from components.
    async (requestParams: IRequestParams = {}) => {
      const {
        limit = pagination.limit, //if limit page and body are not provided, defaults to what's currently set.
        page: currentPage = pagination.currentPage,
        body: requestBody = body,
      } = requestParams;
      GET && setPagination({ limit, currentPage });
      requestParams.page && delete requestParams.page;
      requestParams.limit && delete requestParams.limit;
      return await doFetch(endpoint, requestParams, requestBody);
    },
    [endpoint]
  );

  return {
    data,
    request,
    response,
    loading,
    error,
    arrayData,
    //abort,
  };
}

export default useApi;
