import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClipboardJS from "clipboard";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormSelect, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import MBSpinner from "../../components/MBSpinner";
import MBTHeadItem from "../../components/MBTHeadItem";
import MBTableFooter from "../../components/MBTableFooter";
import { formatCurrency, handleChangeCheck, handleChangeInput, handleChangeSelect } from "../../functions";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import categories from "../../http/categories";
import GetListCategoryListItemDto from "../../http/categories/models/queries/getList/getListCategoryListItemDto";
import partners from "../../http/partners";
import GetListPartnerListItemDto from "../../http/partners/models/queries/getList/getListPartnerListItemDto";
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
  const [partnersResponse, setPartnersResponse] = useState<GetListResponse<GetListPartnerListItemDto>>(null);
  const [partnersLoaded, setPartnersLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (productsLoaded && !categoriesLoaded && !partnersLoaded) fetchCategories().finally(fetchPartners);
  }, [productsLoaded, categoriesLoaded, partnersLoaded]);

  useEffect(() => {
    setProductsLoaded(false);

    const dynamicQuery: DynamicQuery = { filter: null, sort: [] };

    const dir = searchValues.descending ? "desc" : "asc";
    searchValues.orderBy.split(",").forEach((field) => dynamicQuery.sort.push({ field, dir }));

    const nameFilter: Filter = { field: "name", operator: "contains", value: searchValues.name };
    const categoryIdFilter: Filter = { field: "categoryId", operator: "eq", value: searchValues.categoryId.toString() };
    const barcodeNumberFilter: Filter = { field: "barcodeNumber", operator: "contains", value: searchValues.barcodeNumber };
    const modelNumberFilter: Filter = { field: "modelNumber", operator: "contains", value: searchValues.modelNumber };
    const minPurchasePriceFilter: Filter = { field: "purchasePrice", operator: "gte", value: searchValues.minPurchasePrice };
    const maxPurchasePriceFilter: Filter = { field: "purchasePrice", operator: "lte", value: searchValues.maxPurchasePrice };
    const statusFilter: Filter = { field: "status", operator: "eq", value: searchValues.status ? "true" : "false" };

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

    if (minPurchasePriceFilter.value) {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(minPurchasePriceFilter);
        else dynamicQuery.filter.filters = [minPurchasePriceFilter];
      } else dynamicQuery.filter = minPurchasePriceFilter;
    }

    if (maxPurchasePriceFilter.value) {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(maxPurchasePriceFilter);
        else dynamicQuery.filter.filters = [maxPurchasePriceFilter];
      } else dynamicQuery.filter = maxPurchasePriceFilter;
    }

    if (statusFilter.value === "true") {
      if (dynamicQuery.filter) {
        dynamicQuery.filter.logic = "and";
        if (dynamicQuery.filter.filters) dynamicQuery.filter.filters.push(statusFilter);
        else dynamicQuery.filter.filters = [statusFilter];
      } else dynamicQuery.filter = statusFilter;
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
                  {categoriesLoaded &&
                    categoriesResponse?.items
                      ?.sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
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
                  step="any"
                  name="minPurchasePrice"
                  placeholder="Min. Alış Fiyatı"
                  value={searchValues.minPurchasePrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </div>
              <div className="col-6 col-sm-4 col-md-3">
                <FormControl
                  type="number"
                  step="any"
                  name="maxPurchasePrice"
                  placeholder="Maks. Alış Fiyatı"
                  value={searchValues.maxPurchasePrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setSearchValues)}
                />
              </div>
              <div className="col">
                <FormCheck
                  id="productsFilterStatusCheck"
                  type="switch"
                  name="status"
                  label="Tükenenleri Gösterme"
                  checked={searchValues.status}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChangeCheck(e, setSearchValues);
                    handleSubmit();
                  }}
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
                  <MBTHeadItem responsive={true} searchValues={searchValues} setSearchValues={setSearchValues} title="#" value="id" />
                  <MBTHeadItem responsive={true} searchValues={searchValues} setSearchValues={setSearchValues} title="Ad" value="name" />
                  <MBTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Kategori"
                    value="category.name"
                  />
                  <MBTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Barkod No."
                    value="barcodeNumber"
                  />
                  <MBTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Model No."
                    value="modelNumber"
                  />
                  <MBTHeadItem
                    responsive={true}
                    searchValues={searchValues}
                    setSearchValues={setSearchValues}
                    title="Alış Fiyatı"
                    value="purchasePrice"
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
                    <td>{formatCurrency(product.purchasePrice)}</td>
                    <td className="text-end">
                      <InfoModal product={product} partnersLoaded={partnersLoaded} partnersResponse={partnersResponse} />
                      <UpdateModal
                        fetchProducts={handleSubmit}
                        product={product}
                        categoriesResponse={categoriesResponse}
                        categoriesLoaded={categoriesLoaded}
                        imageUrl={product.imageUrl}
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
              <MBTableFooter data={productsResponse} setPage={setPageIndex} setPageSize={setPageSize} pageSize={pageRequest.pageSize} />
            )}
          </>
        ) : (
          <MBSpinner />
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
  minPurchasePrice: "",
  maxPurchasePrice: "",
  status: true,
  orderBy: "barcodeNumber",
  descending: true,
};

const defaultPageRequest = { pageIndex: 0, pageSize: 50 };
