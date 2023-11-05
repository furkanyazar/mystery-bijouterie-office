import { faInfoCircle, faPen, faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CustomSpinner from "../../components/CustomSpinner";
import CustomTableFooter from "../../components/CustomTableFooter";
import categories from "../../http/categories";
import GetListByDynamicCategoryListItemDto from "../../http/categories/models/responses/getListByDynamicCategoryListItemDto";
import DynamicQuery, { Filter } from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import { handleChangeInput } from "../../functions";
import { Form, Formik } from "formik";
import CustomTHeadItem from "../../components/CustomTHeadItem";

export default function index() {
  const [searchValues, setSearchValues] = useState({ ...defaultSearchValues });
  const [pageRequest, setPageRequest] = useState<PageRequest>({ ...defaultPageRequest });
  const [categoriesResponse, setCategoriesResponse] = useState<GetListResponse<GetListByDynamicCategoryListItemDto>>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);

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
      .getListByDynamicCategory(dynamicQuery, pageRequest)
      .then((response) => setCategoriesResponse(response.data))
      .catch((errorResponse) => {})
      .finally(() => setCategoriesLoaded(true));

  const setPageIndex = (pageIndex: number) => setPageRequest({ ...pageRequest, pageIndex });

  const setPageSize = (pageSize: number) => setPageRequest({ pageIndex: 0, pageSize });

  const setDefaultSearch = () => setSearchValues({ ...defaultSearchValues });

  const handleSubmit = () => setPageRequest({ ...defaultPageRequest, pageSize: pageRequest.pageSize });

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
            <Button variant="success">
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
        </Row>
        <hr />
        <Formik initialValues={searchValues} onSubmit={handleSubmit}>
          <Form>
            <Row className="g-2 d-flex align-items-center">
              <Col className="col-3">
                <FormControl
                  name="name"
                  placeholder="Ad"
                  value={searchValues.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </Col>
              <Col className="col-auto ms-auto">
                <Button type="submit" variant="primary" className="me-1">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
                <Button variant="warning" className="text-white" onClick={setDefaultSearch}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Col>
            </Row>
          </Form>
        </Formik>
        <hr />
        {categoriesLoaded ? (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <CustomTHeadItem responsive={true} searchValues={searchValues} setSearchValues={setSearchValues} title="#" value="id" />
                  <CustomTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Ad"
                    value="name"
                  />
                  <CustomTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Komisyon O."
                    value="commissionRate"
                  />
                  <th className="responsive-thead-item"></th>
                </tr>
              </thead>
              <tbody>
                {categoriesResponse?.items.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.commissionRate}</td>
                    <td className="text-end">
                      <Button className="btn-sm" variant="primary">
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </Button>
                      <Button className="btn-sm text-white ms-1" variant="warning">
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                      <Button className="btn-sm ms-1" variant="danger">
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {categoriesResponse && (
              <CustomTableFooter
                data={categoriesResponse}
                setPage={setPageIndex}
                setPageSize={setPageSize}
                pageSize={pageRequest.pageSize}
              />
            )}
          </>
        ) : (
          <CustomSpinner />
        )}
      </Container>
    </>
  );
}

const defaultSearchValues = { name: "", orderBy: "id", descending: false };

const defaultPageRequest = { pageIndex: 0, pageSize: 10 };
