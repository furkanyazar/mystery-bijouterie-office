import DynamicQuery from "../../../../../models/dynamicQuery";
import PageRequest from "../../../../../models/pageRequest";

export default interface GetListByDynamicCategoryQuery {
  pageRequest?: PageRequest;
  dynamicQuery: DynamicQuery;
}
