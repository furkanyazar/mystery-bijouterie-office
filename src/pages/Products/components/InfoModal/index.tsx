import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faInfoCircle, faPlus, faSave, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row, Table } from "react-bootstrap";
import ModalImage from "react-modal-image";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MBTextEditor from "../../../../components/MBTextEditor";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { ValidationRequired } from "../../../../constants/validationMessages";
import { formatCurrency } from "../../../../functions";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import GetListPartnerListItemDto from "../../../../http/partners/models/queries/getList/getListPartnerListItemDto";
import products from "../../../../http/products";
import UpdateSalePriceCommand from "../../../../http/products/models/commands/updateSalePrice/updateSalePriceCommand";
import GetByIdProductResponse from "../../../../http/products/models/queries/getById/getByIdProductResponse";
import GetListResponse from "../../../../models/getListResponse";
import { addDiscount, removeDiscount, updateDiscount } from "../../../../store/slices/appSlice";

export default function index({ product, partnersLoaded, partnersResponse }: Props) {
  const dispatch = useAppDispatch();

  const { discounts } = useAppSelector((state) => state.appItems);

  const [show, setShow] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(product.salePrice);
  const [partnerPrices, setPartnerPrices] = useState<PriceItemDto[]>([]);
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
    if (partnersLoaded && partnersResponse?.items) {
      setPartnerPrices([
        ...partnersResponse.items.map((partner) => {
          let partnerId: number = partner.id;
          let salePrice: number = price && !isNaN(price) ? price : 0;
          let discountedPrice: number = salePrice;
          let purchasePrice: number = product.purchasePrice;
          let currentDiscounts: number[] = [];

          discounts.forEach((discount) => {
            let discountAmount: number = discount && !isNaN(discount.amount) ? discount.amount : 0;
            let discountPrice: number = discount.type === "amount" ? discountAmount : (discountedPrice * discountAmount) / 100;
            discountedPrice -= discountPrice;
            currentDiscounts.push(discountPrice);
          });

          let commissionRate: number = product.categoryCategoryPartners.find((c) => c.partnerId === partner.id)?.commissionRate ?? 0;
          let commissionAmount: number = (discountedPrice * commissionRate) / 100;
          let shippingCost: number = partner.hasFreeShipping
            ? discountedPrice >= partner.freeShippingLowerLimit
              ? partner.shippingCost
              : 0
            : partner.shippingCost;
          let serviceFee: number = partner.serviceFee;

          let additionalExpenses: number = Number.parseFloat(process.env.ADDITIONAL_EXPENSES);
          let vatRate: number = Number.parseFloat(process.env.VAT_RATE);
          let totalVAT: number = (commissionAmount * vatRate) / 100 + (shippingCost * vatRate) / 100 + (serviceFee * vatRate) / 100;
          let estimatedEarnings: number =
            discountedPrice - purchasePrice - commissionAmount - shippingCost - additionalExpenses - totalVAT - serviceFee;

          return {
            partnerId,
            salePrice,
            discountedPrice,
            purchasePrice,
            commissionAmount,
            shippingCost,
            additionalExpenses,
            totalVAT,
            estimatedEarnings,
            currentDiscounts,
            serviceFee,
          };
        }),
      ]);
    }
  }, [partnersLoaded, partnersResponse, price, discounts]);

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
        footerLeft={<FormCheck type="switch" id="infoProductModalStatusCheck" label="Stokta Var" checked={product.status} readOnly />}
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
                <Col md={6}>
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
                <Col md={6}>
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
                <Col md={6}>
                  <FormGroup className="mb-3" controlId="infoProductModalCategoryNameInput">
                    <FormLabel>Kategori</FormLabel>
                    <FormControl placeholder="Kategori" value={product.categoryName ?? ""} readOnly />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3" controlId="infoProductModalUnitPriceInput">
                    <FormLabel>Alış Fiyatı</FormLabel>
                    <InputGroup>
                      <FormControl placeholder="Alış Fiyatı" value={product.purchasePrice} readOnly />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormLabel htmlFor="infoProductModalDescriptionInput">Açıklama</FormLabel>
                  <MBTextEditor id="infoProductModalDescriptionInput" value={product.description ?? ""} disabled />
                </Col>
              </Row>
            </Col>
          </Row>
          {partnersLoaded && product.purchasePrice > 0 && (
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
                                  {loading ? (
                                    <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" />
                                  ) : (
                                    <FontAwesomeIcon icon={faSave} />
                                  )}
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
                                className={partnerPrice.salePrice < 0 ? "text-danger" : partnerPrice.salePrice > 0 ? "text-success" : ""}
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
                                    partnerPrice.currentDiscounts[index] < 0
                                      ? "text-success"
                                      : partnerPrice.currentDiscounts[index] > 0
                                      ? "text-danger"
                                      : ""
                                  }
                                >
                                  {formatCurrency(-partnerPrice.currentDiscounts[index])}
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
                                    partnerPrice.discountedPrice < 0
                                      ? "text-danger"
                                      : partnerPrice.discountedPrice > 0
                                      ? "text-success"
                                      : ""
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
                                  partnerPrice.purchasePrice < 0 ? "text-success" : partnerPrice.purchasePrice > 0 ? "text-danger" : ""
                                }
                              >
                                {formatCurrency(-partnerPrice.purchasePrice)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Komisyon Tutarı</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  partnerPrice.commissionAmount < 0
                                    ? "text-success"
                                    : partnerPrice.commissionAmount > 0
                                    ? "text-danger"
                                    : ""
                                }
                              >
                                {formatCurrency(-partnerPrice.commissionAmount)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Hizmet Bedeli</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={partnerPrice.serviceFee < 0 ? "text-success" : partnerPrice.serviceFee > 0 ? "text-danger" : ""}
                              >
                                {formatCurrency(-partnerPrice.serviceFee)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Kargo Ücreti</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  partnerPrice.shippingCost < 0 ? "text-success" : partnerPrice.shippingCost > 0 ? "text-danger" : ""
                                }
                              >
                                {formatCurrency(-partnerPrice.shippingCost)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Toplam KDV</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={partnerPrice.totalVAT < 0 ? "text-success" : partnerPrice.totalVAT > 0 ? "text-danger" : ""}
                              >
                                {formatCurrency(-partnerPrice.totalVAT)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Ek Giderler</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  partnerPrice.additionalExpenses < 0
                                    ? "text-success"
                                    : partnerPrice.additionalExpenses > 0
                                    ? "text-danger"
                                    : ""
                                }
                              >
                                {formatCurrency(-partnerPrice.additionalExpenses)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Tahminî Kâr</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={
                                  partnerPrice.estimatedEarnings < 0
                                    ? "text-danger"
                                    : partnerPrice.estimatedEarnings > 0
                                    ? "text-success"
                                    : ""
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
}

interface PriceItemDto {
  partnerId: number;
  salePrice: number;
  discountedPrice: number;
  purchasePrice: number;
  commissionAmount: number;
  shippingCost: number;
  additionalExpenses: number;
  totalVAT: number;
  estimatedEarnings: number;
  currentDiscounts: number[];
  serviceFee: number;
}

const defaultImageUrl = process.env.DEFAULT_IMAGE_URL;
