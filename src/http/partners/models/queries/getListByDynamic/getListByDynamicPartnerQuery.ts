import DynamicQuery from "../../../../../models/dynamicQuery";
import PageRequest from "../../../../../models/pageRequest";

export default interface GetListByDynamicPartnerQuery {
  pageRequest?: PageRequest;
  dynamicQuery: DynamicQuery;
}
