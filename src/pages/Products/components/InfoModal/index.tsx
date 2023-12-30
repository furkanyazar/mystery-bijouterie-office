import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faCircleNotch, faInfoCircle, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row, Table } from "react-bootstrap";
import ModalImage from "react-modal-image";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBSpinner from "../../../../components/MBSpinner";
import MBTextEditor from "../../../../components/MBTextEditor";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationRequired } from "../../../../constants/validationMessages";
import { formatCurrency } from "../../../../functions";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import GetListMaterialListItemDto from "../../../../http/materials/models/queries/getList/getListMaterialListItemDto";
import GetListPartnerListItemDto from "../../../../http/partners/models/queries/getList/getListPartnerListItemDto";
import products from "../../../../http/products";
import UpdateSalePriceCommand from "../../../../http/products/models/commands/updateSalePrice/updateSalePriceCommand";
import GetByIdProductResponse from "../../../../http/products/models/queries/getById/getByIdProductResponse";
import GetListResponse from "../../../../models/getListResponse";
import { addDiscount, removeDiscount, updateDiscount } from "../../../../store/slices/appSlice";

export default function index({ product, partnersLoaded, partnersResponse, materialsLoaded, materialsResponse }: Props) {
  const dispatch = useAppDispatch();

  const { discounts } = useAppSelector((state) => state.appItems);

  const [show, setShow] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(product.salePrice);
  const [partnerPrices, setPartnerPrices] = useState<PriceItemDto[]>([]);
  const [productMaterials, setProductMaterials] = useState(product?.productMaterials);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalButtons, setModalButtons] = useState<ButtonProps[]>([
    {
      key: "ok",
      variant: "primary",
      text: "Tamam",
      disabled: loading,
      loading: false,
      icon: faCircleCheck,
      handleClick: () => handleClose(),
    },
  ]);

  useEffect(() => {
    if (show) {
      setPartnerPrices([
        ...partnersResponse?.items?.map((partner) => {
          let partnerId: number = partner.id;
          let salePrice: number = price && !isNaN(price) ? price : 0;
          let discountedPrice: number = salePrice;
          let purchasePrice: number = product?.purchasePrice;
          let currentDiscounts: number[] = [];

          discounts.forEach((discount) => {
            let discountAmount: number = discount && !isNaN(discount.amount) ? discount.amount : 0;
            let discountPrice: number = discount.type === "amount" ? discountAmount : (discountedPrice * discountAmount) / 100;
            discountedPrice -= discountPrice;
            currentDiscounts.push(discountPrice);
          });

          let commissionRate: number = product?.categoryCategoryPartners?.find((c) => c.partnerId === partner.id)?.commissionRate ?? 0;
          let commissionAmount: number = (discountedPrice * commissionRate) / 100;
          let shippingCost: number = partner.hasShippingScale
            ? discountedPrice >= partner.firstScaleLowerLimit && discountedPrice <= partner.firstScaleUpperLimit
              ? partner.firstScaleShippingFee
              : discountedPrice >= partner.secondScaleLowerLimit && discountedPrice <= partner.secondScaleUpperLimit
              ? partner.secondScaleShippingFee
              : partner.shippingCost
            : partner.shippingCost;
          let serviceFee: number = partner.serviceFee;
          let transactionFee: number = partner.transactionFee;

          let additionalExpenses: number = 0;
          productMaterials?.forEach(
            (productMaterial) => (additionalExpenses += productMaterial.materialPurchasePrice / productMaterial.materialUnitsInStock)
          );

          let vatRate: number = Number.parseFloat(process.env.VAT_RATE);
          if (!partner.hasTaxCommissions) commissionAmount += (commissionAmount * vatRate) / 100;
          if (!partner.hasTaxShippingCost) shippingCost += (shippingCost * vatRate) / 100;
          if (!partner.hasTaxServiceFee) serviceFee += (serviceFee * vatRate) / 100;
          if (!partner.hasTaxTransactionFee) transactionFee += (transactionFee * 20) / 100;

          let estimatedEarnings: number =
            discountedPrice - purchasePrice - commissionAmount - shippingCost - additionalExpenses - serviceFee - transactionFee;

          return {
            partnerId,
            salePrice,
            discountedPrice,
            purchasePrice,
            commissionAmount,
            shippingCost,
            additionalExpenses,
            estimatedEarnings,
            currentDiscounts,
            serviceFee: serviceFee + transactionFee,
          };
        }),
      ]);
    }
  }, [show, price, discounts, partnersResponse, product, productMaterials]);

  useEffect(() => {
    setModalButtons((prev) => [...prev.map((c) => ({ ...c, disabled: loading }))]);
  }, [loading]);

  const handleSubmitSalePrice = async () => {
    setLoading(true);
    const updateSalePriceCommand: UpdateSalePriceCommand = { id: product.id, salePrice: price };
    await products
      .updateSalePrice(updateSalePriceCommand)
      .then((response) => toast.success("Satış fiyatı başarılı bir şekilde güncellendi."))
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const validationSchema = Yup.object({
    salePrice: Yup.string().matches(/^(?:(?!NaN).)*$/, ValidationRequired),
  });

  return (
    <>
      <Button className="btn-sm ms-1" variant="primary" onClick={handleShow}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </Button>
      <MBModal
        id={`infoProductModal-${product.id}`}
        closable={!loading}
        handleClose={handleClose}
        show={show}
        title="Ürün Detayı"
        buttons={modalButtons}
        size="xl"
        footerLeft={
          <FormCheck type="switch" id="infoProductModalStatusCheck" label="Stokta Var" checked={product.unitsInStock > 0} readOnly />
        }
      >
        <Container>
          <Row>
            <Col md={12} lg={4} className="mb-3">
              <Row>
                <Col md={12} className="mb-3">
                  <FormLabel>Görsel</FormLabel>
                  <ModalImage
                    small={product.imageUrl ?? defaultImageUrl}
                    large={product.imageUrl ?? defaultImageUrl}
                    className="img-thumbnail"
                  />
                </Col>
                {materialsLoaded ? (
                  <>
                    <hr />
                    <Col md={12} className="text-center mb-3">
                      <h6>Materyaller</h6>
                    </Col>
                    {materialsResponse?.items
                      ?.sort((a, b) => a.name.localeCompare(b.name))
                      .map((material) => (
                        <Col className="col-auto mb-1" key={material.id}>
                          <FormGroup controlId={`infoProductModalMaterialInput-${material.id}`}>
                            <FormCheck
                              label={material.name}
                              checked={productMaterials?.map((c) => c.materialId).includes(material.id)}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setProductMaterials((prev) => [
                                    ...prev,
                                    {
                                      id: Math.random(),
                                      materialId: material.id,
                                      materialName: material.name,
                                      materialPurchasePrice: material.purchasePrice,
                                      materialUnitsInStock: material.unitsInStock,
                                    },
                                  ]);
                                else setProductMaterials((prev) => [...prev.filter((c) => c.materialId !== material.id)]);
                              }}
                            />
                          </FormGroup>
                        </Col>
                      ))}
                  </>
                ) : (
                  <MBSpinner />
                )}
              </Row>
            </Col>
            <Col md={12} lg={8}>
              <Row>
                <Col md={12}>
                  <FormGroup className="mb-3" controlId="infoProductModalNameInput">
                    <FormLabel>Ad</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="Ad" value={product.name} readOnly />
                      <Button variant="secondary" className="btn-clipboard" data-clipboard-text={product.name}>
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoProductModalStockKodeInput">
                    <FormLabel>Stok Kodu</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="Stok Kodu" value={product.stockCode ?? ""} readOnly />
                      <Button
                        variant="secondary"
                        className="btn-clipboard"
                        data-clipboard-text={product.stockCode}
                        disabled={!product.stockCode}
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoProductModalBarcodeNumberInput">
                    <FormLabel>Barkod No.</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="MB-0000000001" value={product.barcodeNumber} readOnly />
                      <Button variant="secondary" className="btn-clipboard" data-clipboard-text={product.barcodeNumber}>
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoProductModalModelNumberInput">
                    <FormLabel>Model No.</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="MB-00001" value={product.modelNumber} readOnly />
                      <Button variant="secondary" className="btn-clipboard" data-clipboard-text={product.modelNumber}>
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoProductModalCategoryNameInput">
                    <FormLabel>Kategori</FormLabel>
                    <FormControl placeholder="Kategori" value={product.categoryName ?? ""} readOnly />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoProductModalUnitPriceInput">
                    <FormLabel>Alış Fiyatı</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="Alış Fiyatı" value={product.purchasePrice} readOnly />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3" controlId="infoProductModalUnitsInStockInput">
                    <FormLabel>Stok Miktarı</FormLabel>
                    <FormControl placeholder="Stok Miktarı" value={product.unitsInStock} readOnly />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormLabel htmlFor="infoProductModalDescriptionInput">Açıklama</FormLabel>
                  <MBTextEditor id="infoProductModalDescriptionInput" value={product.description ?? ""} disabled />
                </Col>
              </Row>
            </Col>
          </Row>
          {partnersLoaded ? (
            <>
              <hr />
              <Row>
                <Col md={12} className="text-center mb-2">
                  <h5>Fiyat Hesapla</h5>
                </Col>
                <Col md={12} lg={4}>
                  <Row>
                    <Col xs={8} lg={12} xl={8}>
                      <Formik
                        initialValues={{ salePrice: price }}
                        onSubmit={handleSubmitSalePrice}
                        enableReinitialize
                        validationSchema={validationSchema}
                        validateOnChange={false}
                        validateOnBlur={false}
                      >
                        {({ errors }) => (
                          <Form id="updateSalePriceForm">
                            <FormGroup className="mb-3" controlId="infoProductModalPriceInput">
                              <FormLabel>Satış Fiyatı</FormLabel>
                              <InputGroup>
                                <FormControl
                                  type="number"
                                  step="any"
                                  className={errors.salePrice && "is-invalid"}
                                  placeholder="Fiyat Hesapla"
                                  name="salePrice"
                                  value={!isNaN(price) ? price : ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(Number.parseFloat(e.target.value))}
                                />
                                <InputGroup.Text>₺</InputGroup.Text>
                                <Button
                                  type="submit"
                                  form="updateSalePriceForm"
                                  variant="warning"
                                  className="text-white"
                                  disabled={loading}
                                >
                                  <FontAwesomeIcon icon={loading ? faCircleNotch : faSave} className={loading ? "fa-spin" : undefined} />
                                </Button>
                                {errors.salePrice && <div className="invalid-feedback">{errors.salePrice}</div>}
                              </InputGroup>
                            </FormGroup>
                          </Form>
                        )}
                      </Formik>
                    </Col>
                    <Col xs={4} lg={12} xl={4} className="mb-3">
                      <FormLabel>İndirimler</FormLabel>
                      <br />
                      <Button variant="success" onClick={() => dispatch(addDiscount({ amount: 0, type: "amount" }))}>
                        <FontAwesomeIcon icon={faPlus} className="me-1" />
                        Ekle
                      </Button>
                    </Col>
                    {discounts.map((discount, index) => (
                      <Row key={discount.id}>
                        <hr />
                        <h6>{index + 1}. İndirim</h6>
                        <Col md={12} className="mb-2">
                          <FormCheck
                            type="radio"
                            id={"infoProductModalDiscountAmountInput-" + discount.id}
                            className="d-inline-block me-3"
                            label="Tutar İndirimi"
                            value="amount"
                            checked={discount.type === "amount"}
                            onChange={(e: any) => {
                              if (e.target.checked)
                                dispatch(updateDiscount({ id: discount.id, amount: discount.amount, type: e.target.value }));
                            }}
                          />
                          <FormCheck
                            type="radio"
                            id={"infoProductModalDiscountPercentInput-" + discount.id}
                            className="d-inline-block"
                            label="Yüzde İndirimi"
                            value="percent"
                            checked={discount.type === "percent"}
                            onChange={(e: any) => {
                              if (e.target.checked)
                                dispatch(updateDiscount({ id: discount.id, amount: discount.amount, type: e.target.value }));
                            }}
                          />
                        </Col>
                        <Col md={12}>
                          <FormGroup className="mb-3" controlId="infoProductModalDiscountInput">
                            <FormLabel>{discount.type === "amount" ? "İndirim Tutarı" : "İndirim Oranı"}</FormLabel>
                            <InputGroup>
                              <FormControl
                                type="number"
                                step="any"
                                placeholder={discount.type === "amount" ? "İndirim Tutarı" : "İndirim Oranı"}
                                value={!isNaN(discount.amount) ? discount.amount : ""}
                                onChange={(e: any) =>
                                  dispatch(updateDiscount({ id: discount.id, amount: e.target.value, type: discount.type }))
                                }
                              />
                              <InputGroup.Text>{discount.type === "amount" ? "₺" : "%"}</InputGroup.Text>
                              <Button variant="danger" onClick={() => dispatch(removeDiscount(discount.id))}>
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                    ))}
                  </Row>
                </Col>
                <Col md={12} lg={8}>
                  <Row>
                    <Col md={12}>
                      <Table striped hover responsive border={1}>
                        <thead>
                          <tr>
                            <th></th>
                            {partnersResponse?.items?.map((partner) => (
                              <th key={partner.id}>{partner.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>Satış Fiyatı</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  formatCurrency(partnerPrice.salePrice).startsWith("-")
                                    ? "text-danger"
                                    : formatCurrency(partnerPrice.salePrice) === "₺0,00"
                                    ? ""
                                    : "text-success"
                                }
                              >
                                {formatCurrency(partnerPrice.salePrice)}
                              </td>
                            ))}
                          </tr>
                          {discounts.map((discount, index) => (
                            <tr key={index}>
                              <th>
                                {index + 1}. İndirim ({discount.type === "amount" ? formatCurrency(discount.amount) : discount.amount + "%"}
                                )
                              </th>
                              {partnerPrices.map((partnerPrice) => (
                                <td
                                  key={partnerPrice.partnerId}
                                  className={
                                    formatCurrency(
                                      partnerPrice.currentDiscounts[index] !== 0
                                        ? -partnerPrice.currentDiscounts[index]
                                        : partnerPrice.currentDiscounts[index]
                                    ).startsWith("-")
                                      ? "text-danger"
                                      : formatCurrency(
                                          partnerPrice.currentDiscounts[index] !== 0
                                            ? -partnerPrice.currentDiscounts[index]
                                            : partnerPrice.currentDiscounts[index]
                                        ) === "₺0,00"
                                      ? ""
                                      : "text-success"
                                  }
                                >
                                  {formatCurrency(
                                    partnerPrice.currentDiscounts[index] !== 0
                                      ? -partnerPrice.currentDiscounts[index]
                                      : partnerPrice.currentDiscounts[index]
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                          {discounts.length > 0 && (
                            <tr>
                              <th>İndirimli Satış Fiyatı</th>
                              {partnerPrices.map((partnerPrice) => (
                                <td
                                  key={partnerPrice.partnerId}
                                  className={
                                    formatCurrency(partnerPrice.discountedPrice).startsWith("-")
                                      ? "text-danger"
                                      : formatCurrency(partnerPrice.discountedPrice) === "₺0,00"
                                      ? ""
                                      : "text-success"
                                  }
                                >
                                  {formatCurrency(partnerPrice.discountedPrice)}
                                </td>
                              ))}
                            </tr>
                          )}
                          <tr>
                            <th>Alış Fiyatı</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  formatCurrency(
                                    partnerPrice.purchasePrice !== 0 ? -partnerPrice.purchasePrice : partnerPrice.purchasePrice
                                  ).startsWith("-")
                                    ? "text-danger"
                                    : formatCurrency(
                                        partnerPrice.purchasePrice !== 0 ? -partnerPrice.purchasePrice : partnerPrice.purchasePrice
                                      ) === "₺0,00"
                                    ? ""
                                    : "text-success"
                                }
                              >
                                {formatCurrency(
                                  partnerPrice.purchasePrice !== 0 ? -partnerPrice.purchasePrice : partnerPrice.purchasePrice
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Komisyon Tutarı</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  formatCurrency(
                                    partnerPrice.commissionAmount !== 0 ? -partnerPrice.commissionAmount : partnerPrice.commissionAmount
                                  ).startsWith("-")
                                    ? "text-danger"
                                    : formatCurrency(
                                        partnerPrice.commissionAmount !== 0 ? -partnerPrice.commissionAmount : partnerPrice.commissionAmount
                                      ) === "₺0,00"
                                    ? ""
                                    : "text-success"
                                }
                              >
                                {formatCurrency(
                                  partnerPrice.commissionAmount !== 0 ? -partnerPrice.commissionAmount : partnerPrice.commissionAmount
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Hizmet Bedeli</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  formatCurrency(
                                    partnerPrice.serviceFee !== 0 ? -partnerPrice.serviceFee : partnerPrice.serviceFee
                                  ).startsWith("-")
                                    ? "text-danger"
                                    : formatCurrency(partnerPrice.serviceFee !== 0 ? -partnerPrice.serviceFee : partnerPrice.serviceFee) ===
                                      "₺0,00"
                                    ? ""
                                    : "text-success"
                                }
                              >
                                {formatCurrency(partnerPrice.serviceFee !== 0 ? -partnerPrice.serviceFee : partnerPrice.serviceFee)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Kargo Ücreti</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  formatCurrency(
                                    partnerPrice.shippingCost !== 0 ? -partnerPrice.shippingCost : partnerPrice.shippingCost
                                  ).startsWith("-")
                                    ? "text-danger"
                                    : formatCurrency(
                                        partnerPrice.shippingCost !== 0 ? -partnerPrice.shippingCost : partnerPrice.shippingCost
                                      ) === "₺0,00"
                                    ? ""
                                    : "text-success"
                                }
                              >
                                {formatCurrency(partnerPrice.shippingCost !== 0 ? -partnerPrice.shippingCost : partnerPrice.shippingCost)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Ek Giderler</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  formatCurrency(
                                    partnerPrice.additionalExpenses !== 0
                                      ? -partnerPrice.additionalExpenses
                                      : partnerPrice.additionalExpenses
                                  ).startsWith("-")
                                    ? "text-danger"
                                    : formatCurrency(
                                        partnerPrice.additionalExpenses !== 0
                                          ? -partnerPrice.additionalExpenses
                                          : partnerPrice.additionalExpenses
                                      ) === "₺0,00"
                                    ? ""
                                    : "text-success"
                                }
                              >
                                {formatCurrency(
                                  partnerPrice.additionalExpenses !== 0 ? -partnerPrice.additionalExpenses : partnerPrice.additionalExpenses
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Tahminî Kâr</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  formatCurrency(partnerPrice.estimatedEarnings).startsWith("-")
                                    ? "text-danger"
                                    : formatCurrency(partnerPrice.estimatedEarnings) === "₺0,00"
                                    ? ""
                                    : "text-success"
                                }
                              >
                                {formatCurrency(partnerPrice.estimatedEarnings)}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          ) : (
            <MBSpinner />
          )}
        </Container>
      </MBModal>
    </>
  );
}

interface Props {
  product: GetByIdProductResponse;
  partnersResponse: GetListResponse<GetListPartnerListItemDto>;
  partnersLoaded: boolean;
  materialsResponse: GetListResponse<GetListMaterialListItemDto>;
  materialsLoaded: boolean;
}

interface PriceItemDto {
  partnerId: number;
  salePrice: number;
  discountedPrice: number;
  purchasePrice: number;
  commissionAmount: number;
  shippingCost: number;
  additionalExpenses: number;
  estimatedEarnings: number;
  currentDiscounts: number[];
  serviceFee: number;
}

const defaultImageUrl = process.env.DEFAULT_IMAGE_URL;
