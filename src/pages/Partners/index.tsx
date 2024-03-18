import { faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import MBSpinner from "../../components/MBSpinner";
import MBTHeadItem from "../../components/MBTHeadItem";
import MBTableFooter from "../../components/MBTableFooter";
import { handleChangeInput } from "../../functions";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import partners from "../../http/partners";
import GetListPartnerListItemDto from "../../http/partners/models/queries/getList/getListPartnerListItemDto";
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

export default function index({ fetchAllPartners }: Props) {
  const dispatch = useAppDispatch();

  const [searchValues, setSearchValues] = useState({ ...defaultSearchValues });
  const [pageRequest, setPageRequest] = useState<PageRequest>({ ...defaultPageRequest });
  const [partnersResponse, setPartnersResponse] = useState<GetListResponse<GetListPartnerListItemDto>>(null);
  const [partnersLoaded, setPartnersLoaded] = useState<boolean>(false);

  useEffect(() => {
    setPartnersLoaded(false);

    const dynamicQuery: DynamicQuery = { filter: null, sort: [] };

    const dir = searchValues.descending ? "desc" : "asc";
    searchValues.orderBy.split(",").forEach((field) => dynamicQuery.sort.push({ field, dir }));

    const nameFilter: Filter = { field: "name", operator: "contains", value: searchValues.name };

    if (nameFilter.value) dynamicQuery.filter = nameFilter;

    fetchPartners(dynamicQuery);
  }, [pageRequest]);

  useEffect(() => {
    if (partnersLoaded) setPageRequest({ ...pageRequest });
  }, [searchValues.orderBy, searchValues.descending]);

  const fetchPartners = async (dynamicQuery: DynamicQuery) =>
    await partners
      .getListByDynamicPartner({ dynamicQuery, pageRequest })
      .then((response) => setPartnersResponse(response.data))
      .catch((errorResponse) => {})
      .finally(() => setPartnersLoaded(true));

  const setPageIndex = (pageIndex: number) => setPageRequest({ ...pageRequest, pageIndex });

  const setPageSize = (pageSize: number) => setPageRequest({ pageIndex: 0, pageSize });

  const handleSubmit = () => setPageRequest({ ...defaultPageRequest, pageSize: pageRequest.pageSize });

  const handleClear = () => setSearchValues({ ...defaultSearchValues });

  const handleClickRemove = (id: number, name: string) => {
    const cancelButtonKey = "cancel";
    const okButtonKey = "ok";
    dispatch(
      showNotification({
        show: true,
        title: "Partner Sil",
        closable: true,
        description: (
          <>
            <b>{name}</b> adlı partneri silmek istediğinize emin misiniz?
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
              await partners
                .deletePartner({ id })
                .then((response) => {
                  toast.success("Partner başarılı bir şekilde silindi.");
                  dispatch(hideNotification());
                  handleSubmit();
                })
                .catch((errorResponse) => {
                  dispatch(setButtonNotDisabled(cancelButtonKey));
                  dispatch(setButtonNotLoading(okButtonKey));
                })
                .then(fetchAllPartners);
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

  const pageTitle = "Partnerler";

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
            <AddModal fetchPartners={handleSubmit} disabled={!partnersLoaded} fetchAllPartners={fetchAllPartners} />
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
              <div className="col-auto ms-auto">
                <Button variant="warning" className="text-white" onClick={handleClear} disabled={!partnersLoaded}>
                  <FontAwesomeIcon icon={faTrash} className="me-1" /> Temizle
                </Button>
                <Button type="submit" variant="primary" className="ms-1" disabled={!partnersLoaded}>
                  <FontAwesomeIcon icon={faSearch} className="me-1" /> Ara
                </Button>
              </div>
            </Row>
          </Form>
        </Formik>
        <hr />
        {partnersLoaded ? (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <MBTHeadItem responsive searchValues={searchValues} setSearchValues={setSearchValues} title="#" value="id" />
                  <MBTHeadItem responsive searchValues={searchValues} setSearchValues={setSearchValues} title="Ad" value="name" />
                  <th className="responsive-thead-item"></th>
                </tr>
              </thead>
              <tbody>
                {partnersResponse?.items.map((partner) => (
                  <tr key={partner.id}>
                    <td>{partner.id}</td>
                    <td>{partner.name}</td>
                    <td className="text-end">
                      <InfoModal partner={partner} />
                      <UpdateModal fetchPartners={handleSubmit} partner={partner} fetchAllPartners={fetchAllPartners} />
                      <Button className="btn-sm ms-1" variant="danger" onClick={() => handleClickRemove(partner.id, partner.name)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {partnersResponse && (
              <MBTableFooter data={partnersResponse} setPage={setPageIndex} setPageSize={setPageSize} pageSize={pageRequest.pageSize} />
            )}
          </>
        ) : (
          <MBSpinner />
        )}
      </Container>
    </>
  );
}

const defaultSearchValues = { name: "", orderBy: "id", descending: false };

const defaultPageRequest = { pageIndex: 0, pageSize: 50 };

interface Props {
  fetchAllPartners: () => void;
}
