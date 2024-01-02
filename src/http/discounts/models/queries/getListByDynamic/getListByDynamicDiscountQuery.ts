import DynamicQuery from "../../../../../models/dynamicQuery";
import PageRequest from "../../../../../models/pageRequest";

export default interface GetListByDynamicDiscountQuery {
  pageRequest?: PageRequest;
  dynamicQuery: DynamicQuery;
}
