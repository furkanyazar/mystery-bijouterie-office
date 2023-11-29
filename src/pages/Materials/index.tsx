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
import { formatCurrency, handleChangeInput } from "../../functions";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import materials from "../../http/materials";
import GetListMaterialListItemDto from "../../http/materials/models/queries/getList/getListMaterialListItemDto";
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

export default function index() {
  const dispatch = useAppDispatch();

  const [searchValues, setSearchValues] = useState({ ...defaultSearchValues });
  const [pageRequest, setPageRequest] = useState<PageRequest>({ ...defaultPageRequest });
  const [materialsResponse, setMaterialsResponse] = useState<GetListResponse<GetListMaterialListItemDto>>(null);
  const [materialsLoaded, setMaterialsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setMaterialsLoaded(false);

    const dynamicQuery: DynamicQuery = { filter: null, sort: [] };

    const dir = searchValues.descending ? "desc" : "asc";
    searchValues.orderBy.split(",").forEach((field) => dynamicQuery.sort.push({ field, dir }));

    const nameFilter: Filter = { field: "name", operator: "contains", value: searchValues.name };

    if (nameFilter.value) dynamicQuery.filter = nameFilter;

    fetchMaterials(dynamicQuery);
  }, [pageRequest]);

  useEffect(() => {
    if (materialsLoaded) setPageRequest({ ...pageRequest });
  }, [searchValues.orderBy, searchValues.descending]);

  const fetchMaterials = async (dynamicQuery: DynamicQuery) =>
    await materials
      .getListByDynamicMaterial({ dynamicQuery, pageRequest })
      .then((response) => setMaterialsResponse(response.data))
      .catch((errorResponse) => {})
      .finally(() => setMaterialsLoaded(true));

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
        title: "Materyal Sil",
        closable: true,
        description: (
          <>
            <b>{name}</b> adlı materyali silmek istediğinize emin misiniz?
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
              await materials
                .deleteMaterial({ id })
                .then((response) => {
                  toast.success("Materyal başarılı bir şekilde silindi.");
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

  const pageTitle = "Materyaller";

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
            <AddModal fetchMaterials={handleSubmit} disabled={!materialsLoaded} />
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
                <Button type="submit" variant="primary" className="me-1" disabled={!materialsLoaded}>
                  <FontAwesomeIcon icon={faSearch} className="me-1" /> Ara
                </Button>
                <Button variant="warning" className="text-white" onClick={handleClear} disabled={!materialsLoaded}>
                  <FontAwesomeIcon icon={faTrash} className="me-1" /> Temizle
                </Button>
              </div>
            </Row>
          </Form>
        </Formik>
        <hr />
        {materialsLoaded ? (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <MBTHeadItem responsive searchValues={searchValues} setSearchValues={setSearchValues} title="#" value="id" />
                  <MBTHeadItem responsive searchValues={searchValues} setSearchValues={setSearchValues} title="Ad" value="name" />
                  <MBTHeadItem
                    responsive
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Alış Fiyatı"
                    value="purchasePrice"
                  />
                  <MBTHeadItem
                    responsive
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Stok Miktarı"
                    value="unitsInStock"
                  />
                  <th className="responsive-thead-item"></th>
                </tr>
              </thead>
              <tbody>
                {materialsResponse?.items.map((material) => (
                  <tr key={material.id}>
                    <td>{material.id}</td>
                    <td>{material.name}</td>
                    <td>{formatCurrency(material.purchasePrice)}</td>
                    <td>{material.unitsInStock}</td>
                    <td className="text-end">
                      <InfoModal material={material} />
                      <UpdateModal fetchMaterials={handleSubmit} material={material} />
                      <Button className="btn-sm ms-1" variant="danger" onClick={() => handleClickRemove(material.id, material.name)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {materialsResponse && (
              <MBTableFooter data={materialsResponse} setPage={setPageIndex} setPageSize={setPageSize} pageSize={pageRequest.pageSize} />
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
