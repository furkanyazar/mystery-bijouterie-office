import DynamicQuery from "../../../../../models/dynamicQuery";
import PageRequest from "../../../../../models/pageRequest";

export default interface GetListByDynamicMaterialQuery {
  pageRequest?: PageRequest;
  dynamicQuery: DynamicQuery;
}
