import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClipboardJS from "clipboard";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormSelect, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CustomSpinner from "../../components/CustomSpinner";
import CustomTHeadItem from "../../components/CustomTHeadItem";
import CustomTableFooter from "../../components/CustomTableFooter";
import { formatCurrency, handleChangeInput, handleChangeSelect } from "../../functions";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import categories from "../../http/categories";
import GetListCategoryListItemDto from "../../http/categories/models/queries/getList/getListCategoryListItemDto";
import products from "../../http/products";
import GetListByDynamicProductListItemDto from "../../http/products/models/queries/getListByDynamic/getListByDynamicProductListItemDto";
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
  const [productsResponse, setProductsResponse] = useState<GetListResponse<GetListByDynamicProductListItemDto>>(null);
  const [productsLoaded, setProductsLoaded] = useState<boolean>(false);
  const [clipboard, setClipboard] = useState<ClipboardJS>(null);
  const [categoriesResponse, setCategoriesResponse] = useState<GetListResponse<GetListCategoryListItemDto>>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setProductsLoaded(false);

    const dynamicQuery: DynamicQuery = { filter: null, sort: [] };

    const dir = searchValues.descending ? "desc" : "asc";
    searchValues.orderBy.split(",").forEach((field) => dynamicQuery.sort.push({ field, dir }));

    const nameFilter: Filter = { field: "name", operator: "contains", value: searchValues.name };
    const categoryIdFilter: Filter = { field: "categoryId", operator: "eq", value: searchValues.categoryId.toString() };
    const barcodeNumberFilter: Filter = { field: "barcodeNumber", operator: "contains", value: searchValues.barcodeNumber };
    const modelNumberFilter: Filter = { field: "modelNumber", operator: "contains", value: searchValues.modelNumber };
    const minUnitPriceFilter: Filter = { field: "unitPrice", operator: "gte", value: searchValues.minUnitPrice };
    const maxUnitPriceFilter: Filter = { field: "unitPrice", operator: "lte", value: searchValues.maxUnitPrice };

    if (nameFilter.value) dynamicQuery.filter = nameFilter;

    if (categoryIdFilter.value !== "0") {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(categoryIdFilter);
        else dynamicQuery.filter.filters = [categoryIdFilter];
      } else dynamicQuery.filter = categoryIdFilter;
    }

    if (barcodeNumberFilter.value) {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(barcodeNumberFilter);
        else dynamicQuery.filter.filters = [barcodeNumberFilter];
      } else dynamicQuery.filter = barcodeNumberFilter;
    }

    if (modelNumberFilter.value) {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(modelNumberFilter);
        else dynamicQuery.filter.filters = [modelNumberFilter];
      } else dynamicQuery.filter = modelNumberFilter;
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

  useEffect(() => {
    if (productsLoaded) {
      setClipboard(new ClipboardJS(".btn-clipboard"));
    } else {
      if (clipboard) {
        clipboard.destroy();
        setClipboard(null);
      }
    }
  }, [productsLoaded]);

  useEffect(() => {
    if (clipboard)
      clipboard.on("success", () => toast.success("Panoya kopyalandı.")).on("error", () => toast.error("Kopyalama işlemi başarısız."));

    return () => {
      if (clipboard) {
        clipboard.destroy();
        setClipboard(null);
      }
    };
  }, [clipboard]);

  const fetchProducts = async (dynamicQuery: DynamicQuery) =>
    await products
      .getListByDynamicProduct({ dynamicQuery, pageRequest })
      .then((response) => setProductsResponse(response.data))
      .catch((errorResponse) => {})
      .finally(() => setProductsLoaded(true));

  const fetchCategories = async () =>
    await categories
      .getListCategory()
      .then((response) => setCategoriesResponse(response.data))
      .catch((errorResponse) => {})
      .finally(() => setCategoriesLoaded(true));

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
        title: "Ürün Sil",
        closable: true,
        description: (
          <>
            <b>{name}</b> adlı ürünü silmek istediğinize emin misiniz?
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
              await products
                .deleteProduct({ id })
                .then((response) => {
                  toast.success("Ürün başarılı bir şekilde silindi.");
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

  const pageTitle = "Ürünler";

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
              fetchProducts={handleSubmit}
              categoriesResponse={categoriesResponse}
              categoriesLoaded={categoriesLoaded}
              disabled={!productsLoaded}
            />
          </Col>
        </Row>
        <hr />
        <Formik initialValues={searchValues} onSubmit={handleSubmit}>
          <Form>
            <Row className="g-2 d-flex align-items-center">
              <div className="col-6 col-sm-4 col-md-3">
                <FormControl
                  name="name"
                  placeholder="Ad"
                  value={searchValues.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </div>
              <div className="col-6 col-sm-4 col-md-3">
                <FormSelect
                  name="categoryId"
                  value={searchValues.categoryId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeSelect(e, setSearchValues)}
                >
                  <option value={0}>Kategori</option>
                  {categoriesLoaded
                    ? categoriesResponse?.items
                        ?.sort((a, b) => a.name.localeCompare(b.name))
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                    : null}
                </FormSelect>
              </div>
              <div className="col-6 col-sm-4 col-md-3">
                <FormControl
                  name="barcodeNumber"
                  placeholder="Barkod No."
                  value={searchValues.barcodeNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </div>
              <div className="col-6 col-sm-4 col-md-3">
                <FormControl
                  name="modelNumber"
                  placeholder="Model No."
                  value={searchValues.modelNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </div>
              <div className="col-6 col-sm-4 col-md-3">
                <FormControl
                  type="number"
                  name="minUnitPrice"
                  placeholder="Min. Alış Fiyatı"
                  value={searchValues.minUnitPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </div>
              <div className="col-6 col-sm-4 col-md-3">
                <FormControl
                  type="number"
                  name="maxUnitPrice"
                  placeholder="Maks. Alış Fiyatı"
                  value={searchValues.maxUnitPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </div>
              <div className="col-auto ms-auto">
                <Button type="submit" variant="primary" className="me-1" disabled={!productsLoaded}>
                  <FontAwesomeIcon icon={faSearch} className="me-1" /> Ara
                </Button>
                <Button variant="warning" className="text-white" onClick={handleClear} disabled={!productsLoaded}>
                  <FontAwesomeIcon icon={faTrash} className="me-1" /> Temizle
                </Button>
              </div>
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
                    title="Barkod No."
                    value="barcodeNumber"
                  />
                  <CustomTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Model No."
                    value="modelNumber"
                  />
                  <CustomTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Alış Fiyatı"
                    value="unitPrice"
                  />
                  <th className="responsive-thead-item"></th>
                </tr>
              </thead>
              <tbody>
                {productsResponse?.items.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <Button variant="secondary" className="btn-sm me-2 btn-clipboard" data-clipboard-text={product.name}>
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                      {product.name}
                    </td>
                    <td>{product.categoryName}</td>
                    <td>
                      <Button variant="secondary" className="btn-sm me-2 btn-clipboard" data-clipboard-text={product.barcodeNumber}>
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                      {product.barcodeNumber}
                    </td>
                    <td>
                      <Button variant="secondary" className="btn-sm me-2 btn-clipboard" data-clipboard-text={product.modelNumber}>
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                      {product.modelNumber}
                    </td>
                    <td>{formatCurrency(product.unitPrice)}</td>
                    <td className="text-end">
                      <InfoModal product={product} />
                      <UpdateModal
                        fetchProducts={handleSubmit}
                        product={product}
                        categoriesResponse={categoriesResponse}
                        categoriesLoaded={categoriesLoaded}
                      />
                      <Button className="btn-sm ms-1" variant="danger" onClick={() => handleClickRemove(product.id, product.name)}>
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
  categoryId: 0,
  barcodeNumber: "",
  modelNumber: "",
  minUnitPrice: "",
  maxUnitPrice: "",
  orderBy: "id",
  descending: false,
};

const defaultPageRequest = { pageIndex: 0, pageSize: 50 };
