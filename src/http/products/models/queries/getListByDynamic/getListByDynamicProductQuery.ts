import DynamicQuery from "../../../../../models/dynamicQuery";
import PageRequest from "../../../../../models/pageRequest";

export default interface GetListByDynamicProductQuery {
  pageRequest?: PageRequest;
  dynamicQuery: DynamicQuery;
}
