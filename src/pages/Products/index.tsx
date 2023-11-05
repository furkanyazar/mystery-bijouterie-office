import { faInfoCircle, faPen, faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CustomSpinner from "../../components/CustomSpinner";
import CustomTableFooter from "../../components/CustomTableFooter";
import products from "../../http/products";
import GetListByDynamicProductListItemDto from "../../http/products/models/responses/getListByDynamicProductListItemDto";
import DynamicQuery, { Filter } from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import { handleChangeInput } from "../../functions";
import { Form, Formik } from "formik";
import CustomTHeadItem from "../../components/CustomTHeadItem";

export default function index() {
  const [searchValues, setSearchValues] = useState({ ...defaultSearchValues });
  const [pageRequest, setPageRequest] = useState<PageRequest>({ ...defaultPageRequest });
  const [productsResponse, setProductsResponse] = useState<GetListResponse<GetListByDynamicProductListItemDto>>(null);
  const [productsLoaded, setProductsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setProductsLoaded(false);

    const dynamicQuery: DynamicQuery = { filter: null, sort: [] };

    const dir = searchValues.descending ? "desc" : "asc";
    searchValues.orderBy.split(",").forEach((field) => dynamicQuery.sort.push({ field, dir }));

    const nameFilter: Filter = { field: "name", operator: "contains", value: searchValues.name };
    const categoryFilter: Filter = { field: "category.name", operator: "contains", value: searchValues.categoryName };
    const barcodeNumberFilter: Filter = { field: "barcodeNumber", operator: "contains", value: searchValues.barcodeNumber };
    const minUnitPriceFilter: Filter = { field: "unitPrice", operator: "gte", value: searchValues.minUnitPrice };
    const maxUnitPriceFilter: Filter = { field: "unitPrice", operator: "lte", value: searchValues.maxUnitPrice };

    if (nameFilter.value) dynamicQuery.filter = nameFilter;

    if (categoryFilter.value) {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        dynamicQuery.filter.filters = [categoryFilter];
      } else dynamicQuery.filter = categoryFilter;
    }

    if (barcodeNumberFilter.value) {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(barcodeNumberFilter);
        else dynamicQuery.filter.filters = [barcodeNumberFilter];
      } else dynamicQuery.filter = barcodeNumberFilter;
    }

    if (minUnitPriceFilter.value) {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(minUnitPriceFilter);
        else dynamicQuery.filter.filters = [minUnitPriceFilter];
      } else dynamicQuery.filter = minUnitPriceFilter;
    }

    if (maxUnitPriceFilter.value) {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(maxUnitPriceFilter);
        else dynamicQuery.filter.filters = [maxUnitPriceFilter];
      } else dynamicQuery.filter = maxUnitPriceFilter;
    }

    fetchProducts(dynamicQuery);
  }, [pageRequest]);

  useEffect(() => {
    if (productsLoaded) setPageRequest({ ...pageRequest });
  }, [searchValues.orderBy, searchValues.descending]);

  const fetchProducts = async (dynamicQuery: DynamicQuery) =>
    await products
      .getListByDynamicProduct(dynamicQuery, pageRequest)
      .then((response) => setProductsResponse(response.data))
      .catch((errorResponse) => {})
      .finally(() => setProductsLoaded(true));

  const setPageIndex = (pageIndex: number) => setPageRequest({ ...pageRequest, pageIndex });

  const setPageSize = (pageSize: number) => setPageRequest({ pageIndex: 0, pageSize });

  const setDefaultSearch = () => setSearchValues({ ...defaultSearchValues });

  const handleSubmit = () => setPageRequest({ ...defaultPageRequest, pageSize: pageRequest.pageSize });

  const pageTitle = "Ürünler";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Container className="my-5">
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
              <Col className="col-2">
                <FormControl
                  name="name"
                  placeholder="Ad"
                  value={searchValues.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </Col>
              <Col className="col-2">
                <FormControl
                  name="categoryName"
                  placeholder="Kategori"
                  value={searchValues.categoryName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </Col>
              <Col className="col-2">
                <FormControl
                  name="barcodeNumber"
                  placeholder="Barkod"
                  value={searchValues.barcodeNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </Col>
              <Col className="col-2">
                <FormControl
                  type="number"
                  name="minUnitPrice"
                  placeholder="Min. Fiyat"
                  value={searchValues.minUnitPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </Col>
              <Col className="col-2">
                <FormControl
                  type="number"
                  name="maxUnitPrice"
                  placeholder="Maks. Fiyat"
                  value={searchValues.maxUnitPrice}
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
        {productsLoaded ? (
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
                    title="Kategori"
                    value="category.name"
                  />
                  <CustomTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Barkod"
                    value="barcodeNumber"
                  />
                  <CustomTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Fiyat"
                    value="unitPrice"
                  />
                  <th className="responsive-thead-item"></th>
                </tr>
              </thead>
              <tbody>
                {productsResponse?.items.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.categoryName}</td>
                    <td>{product.barcodeNumber ?? ""}</td>
                    <td>{product.unitPrice}</td>
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
            {productsResponse && (
              <CustomTableFooter data={productsResponse} setPage={setPageIndex} setPageSize={setPageSize} pageSize={pageRequest.pageSize} />
            )}
          </>
        ) : (
          <CustomSpinner />
        )}
      </Container>
    </>
  );
}

const defaultSearchValues = {
  name: "",
  categoryName: "",
  barcodeNumber: "",
  minUnitPrice: "",
  maxUnitPrice: "",
  orderBy: "id",
  descending: false,
};

const defaultPageRequest = { pageIndex: 0, pageSize: 50 };
