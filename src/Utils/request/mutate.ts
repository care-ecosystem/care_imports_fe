import { ApiCallOptions, ApiRoute } from "@/Utils/request/types";
import { callApi } from "./query";

function mutate<Route extends ApiRoute<unknown, unknown>>(
  route: Route,
  options?: ApiCallOptions<Route>,
) {
  return (variables: Route["TBody"]) => {
    return callApi(route, { ...options, body: variables });
  };
}

export { mutate };
