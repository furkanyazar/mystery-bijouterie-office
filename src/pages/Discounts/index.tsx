import { faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormSelect, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import MBSpinner from "../../components/MBSpinner";
import MBTHeadItem from "../../components/MBTHeadItem";
import MBTableFooter from "../../components/MBTableFooter";
import { handleChangeInput, handleChangeSelect } from "../../functions";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import discounts from "../../http/discounts";
import GetListDiscountListItemDto from "../../http/discounts/models/queries/getList/getListDiscountListItemDto";
import DynamicQuery, { Filter } from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import {
  hideNotification,
  setButtonDisabled,
  setButtonLoading,
  setButtonNotDisabled,
  setButtonNotLoading,
  showNotification,
} from "../../store/slices/notificationSlice";
import AddModal from "./components/AddModal";
import InfoModal from "./components/InfoModal";
import UpdateModal from "./components/UpdateModal";
import GetListPartnerListItemDto from "../../http/partners/models/queries/getList/getListPartnerListItemDto";
import partners from "../../http/partners";

export default function index() {
  const dispatch = useAppDispatch();

  const [searchValues, setSearchValues] = useState({ ...defaultSearchValues });
  const [pageRequest, setPageRequest] = useState<PageRequest>({ ...defaultPageRequest });
  const [discountsResponse, setDiscountsResponse] = useState<GetListResponse<GetListDiscountListItemDto>>(null);
  const [discountsLoaded, setDiscountsLoaded] = useState<boolean>(false);
  const [partnersResponse, setPartnersResponse] = useState<GetListResponse<GetListPartnerListItemDto>>(null);
  const [partnersLoaded, setPartnersLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (discountsLoaded && !partnersLoaded) fetchPartners();
  }, [discountsLoaded, partnersLoaded]);

  useEffect(() => {
    setDiscountsLoaded(false);

    const dynamicQuery: DynamicQuery = { filter: null, sort: [] };

    const dir = searchValues.descending ? "desc" : "asc";
    searchValues.orderBy.split(",").forEach((field) => dynamicQuery.sort.push({ field, dir }));

    const nameFilter: Filter = { field: "name", operator: "contains", value: searchValues.name };
    const partnerIdFilter: Filter = { field: "partnerId", operator: "eq", value: searchValues.partnerId.toString() };

    if (nameFilter.value) dynamicQuery.filter = nameFilter;

    if (partnerIdFilter.value !== "0") {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(partnerIdFilter);
        else dynamicQuery.filter.filters = [partnerIdFilter];
      } else dynamicQuery.filter = partnerIdFilter;
    }

    fetchDiscounts(dynamicQuery);
  }, [pageRequest]);

  useEffect(() => {
    if (discountsLoaded) setPageRequest({ ...pageRequest });
  }, [searchValues.orderBy, searchValues.descending]);

  const fetchDiscounts = async (dynamicQuery: DynamicQuery) =>
    await discounts
      .getListByDynamicDiscount({ dynamicQuery, pageRequest })
      .then((response) => setDiscountsResponse(response.data))
      .catch((errorResponse) => {})
      .finally(() => setDiscountsLoaded(true));

  const fetchPartners = async () =>
    await partners
      .getListPartner()
      .then((response) => setPartnersResponse(response.data))
      .catch((errorResponse) => {})
      .finally(() => setPartnersLoaded(true));

  const setPageIndex = (pageIndex: number) => setPageRequest({ ...pageRequest, pageIndex });

  const setPageSize = (pageSize: number) => setPageRequest({ pageIndex: 0, pageSize });

  const handleSubmit = () => setPageRequest({ ...defaultPageRequest, pageSize: pageRequest.pageSize });

  const handleClear = () => {
    setSearchValues({ ...defaultSearchValues });
    handleSubmit();
  };

  const handleClickRemove = (id: number, name: string) => {
    const cancelButtonKey = "cancel";
    const okButtonKey = "ok";
    dispatch(
      showNotification({
        show: true,
        title: "İndirim Sil",
        closable: true,
        description: (
          <>
            <b>{name}</b> adlı indirimi silmek istediğinize emin misiniz?
          </>
        ),
        buttons: [
          {
            key: cancelButtonKey,
            text: "Vazgeç",
            handleClick: () => dispatch(hideNotification()),
            variant: "secondary",
            disabled: false,
            loading: false,
            icon: faXmark,
          },
          {
            key: okButtonKey,
            text: "Sil",
            handleClick: async () => {
              dispatch(setButtonDisabled(cancelButtonKey));
              dispatch(setButtonLoading(okButtonKey));
              await discounts
                .deleteDiscount({ id })
                .then((response) => {
                  toast.success("İndirim başarılı bir şekilde silindi.");
                  dispatch(hideNotification());
                  handleSubmit();
                })
                .catch((errorResponse) => {
                  dispatch(setButtonNotDisabled(cancelButtonKey));
                  dispatch(setButtonNotLoading(okButtonKey));
                })
                .finally(() => {});
            },
            variant: "danger",
            disabled: false,
            loading: false,
            icon: faTrash,
          },
        ],
      })
    );
  };

  const pageTitle = "İndirimler";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Container className="my-3">
        <Row>
          <Col className="col-6">
            <h3 className="text-inline">{pageTitle}</h3>
          </Col>
          <Col className="col-6 text-end">
            <AddModal
              disabled={!discountsLoaded}
              fetchDiscounts={handleSubmit}
              partnersLoaded={partnersLoaded}
              partnersResponse={partnersResponse}
            />
          </Col>
        </Row>
        <hr />
        <Formik initialValues={searchValues} onSubmit={handleSubmit}>
          <Form>
            <Row className="g-2 d-flex align-items-center">
              <div className="col-12 col-sm-6 col-md-4">
                <FormControl
                  name="name"
                  placeholder="Ad"
                  value={searchValues.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <FormSelect
                  name="partnerId"
                  value={searchValues.partnerId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeSelect(e, setSearchValues)}
                  disabled={!partnersLoaded}
                >
                  <option value={0}>Partner</option>
                  {partnersLoaded &&
                    partnersResponse?.items
                      ?.sort((a, b) => a.name.localeCompare(b.name))
                      .map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {partner.name}
                        </option>
                      ))}
                </FormSelect>
              </div>
              <div className="col-auto ms-auto">
                <Button variant="warning" className="text-white" onClick={handleClear} disabled={!discountsLoaded}>
                  <FontAwesomeIcon icon={faTrash} className="me-1" /> Temizle
                </Button>
                <Button type="submit" variant="primary" className="ms-1" disabled={!discountsLoaded}>
                  <FontAwesomeIcon icon={faSearch} className="me-1" /> Ara
                </Button>
              </div>
            </Row>
          </Form>
        </Formik>
        <hr />
        {discountsLoaded ? (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <MBTHeadItem responsive searchValues={searchValues} setSearchValues={setSearchValues} title="#" value="id" />
                  <MBTHeadItem
                    responsive
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Partner"
                    value="Partner.Name"
                  />
                  <MBTHeadItem responsive searchValues={searchValues} setSearchValues={setSearchValues} title="Ad" value="name" />
                  <th className="responsive-thead-item"></th>
                </tr>
              </thead>
              <tbody>
                {discountsResponse?.items.map((discount) => (
                  <tr key={discount.id}>
                    <td>{discount.id}</td>
                    <td>{discount.partnerName}</td>
                    <td>{discount.name}</td>
                    <td className="text-end">
                      <InfoModal discount={discount} />
                      <UpdateModal
                        discount={discount}
                        fetchDiscounts={handleSubmit}
                        partnersLoaded={partnersLoaded}
                        partnersResponse={partnersResponse}
                      />
                      <Button className="btn-sm ms-1" variant="danger" onClick={() => handleClickRemove(discount.id, discount.name)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {discountsResponse && (
              <MBTableFooter data={discountsResponse} setPage={setPageIndex} setPageSize={setPageSize} pageSize={pageRequest.pageSize} />
            )}
          </>
        ) : (
          <MBSpinner />
        )}
      </Container>
    </>
  );
}

const defaultSearchValues = { name: "", partnerId: 0, orderBy: "id", descending: false };

const defaultPageRequest = { pageIndex: 0, pageSize: 50 };
