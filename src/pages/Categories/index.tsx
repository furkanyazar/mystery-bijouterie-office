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
import categories from "../../http/categories";
import GetListCategoryListItemDto from "../../http/categories/models/queries/getList/getListCategoryListItemDto";
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

export default function index() {
  const dispatch = useAppDispatch();

  const [searchValues, setSearchValues] = useState({ ...defaultSearchValues });
  const [pageRequest, setPageRequest] = useState<PageRequest>({ ...defaultPageRequest });
  const [categoriesResponse, setCategoriesResponse] = useState<GetListResponse<GetListCategoryListItemDto>>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);
  const [partnersResponse, setPartnersResponse] = useState<GetListResponse<GetListPartnerListItemDto>>(null);
  const [partnersLoaded, setPartnersLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (categoriesLoaded && !partnersLoaded) fetchPartners();
  }, [categoriesLoaded, partnersLoaded]);

  useEffect(() => {
    setCategoriesLoaded(false);

    const dynamicQuery: DynamicQuery = { filter: null, sort: [] };

    const dir = searchValues.descending ? "desc" : "asc";
    searchValues.orderBy.split(",").forEach((field) => dynamicQuery.sort.push({ field, dir }));

    const nameFilter: Filter = { field: "name", operator: "contains", value: searchValues.name };

    if (nameFilter.value) dynamicQuery.filter = nameFilter;

    fetchCategories(dynamicQuery);
  }, [pageRequest]);

  useEffect(() => {
    if (categoriesLoaded) setPageRequest({ ...pageRequest });
  }, [searchValues.orderBy, searchValues.descending]);

  const fetchCategories = async (dynamicQuery: DynamicQuery) =>
    await categories
      .getListByDynamicCategory({ dynamicQuery, pageRequest })
      .then((response) => setCategoriesResponse(response.data))
      .catch((errorResponse) => {})
      .finally(() => setCategoriesLoaded(true));

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
        title: "Kategori Sil",
        closable: true,
        description: (
          <>
            <b>{name}</b> adlı kategoriyi silmek istediğinize emin misiniz?
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
              await categories
                .deleteCategory({ id })
                .then((response) => {
                  toast.success("Kategori başarılı bir şekilde silindi.");
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

  const pageTitle = "Kategoriler";

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
              fetchCategories={handleSubmit}
              disabled={!categoriesLoaded}
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
              <div className="col-auto ms-auto">
                <Button type="submit" variant="primary" className="me-1" disabled={!categoriesLoaded}>
                  <FontAwesomeIcon icon={faSearch} className="me-1" /> Ara
                </Button>
                <Button variant="warning" className="text-white" onClick={handleClear} disabled={!categoriesLoaded}>
                  <FontAwesomeIcon icon={faTrash} className="me-1" /> Temizle
                </Button>
              </div>
            </Row>
          </Form>
        </Formik>
        <hr />
        {categoriesLoaded ? (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <MBTHeadItem responsive={true} searchValues={searchValues} setSearchValues={setSearchValues} title="#" value="id" />
                  <MBTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Ad"
                    value="name"
                  />
                  <th className="responsive-thead-item"></th>
                </tr>
              </thead>
              <tbody>
                {categoriesResponse?.items.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td className="text-end">
                      <InfoModal category={category} partners={partnersResponse} partnersLoaded={partnersLoaded} />
                      <UpdateModal
                        fetchCategories={handleSubmit}
                        category={category}
                        partnersLoaded={partnersLoaded}
                        partnersResponse={partnersResponse}
                      />
                      <Button className="btn-sm ms-1" variant="danger" onClick={() => handleClickRemove(category.id, category.name)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {categoriesResponse && (
              <MBTableFooter
                data={categoriesResponse}
                setPage={setPageIndex}
                setPageSize={setPageSize}
                pageSize={pageRequest.pageSize}
              />
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
