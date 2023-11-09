import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row, Table } from "react-bootstrap";
import CustomModal, { ButtonProps } from "../../../../components/Modals/CustomModal";
import { formatCurrency } from "../../../../functions";
import GetListPartnerListItemDto from "../../../../http/partners/models/queries/getList/getListPartnerListItemDto";
import GetByIdProductResponse from "../../../../http/products/models/queries/getById/getByIdProductResponse";
import GetListResponse from "../../../../models/getListResponse";

export default function index({ product, partnersLoaded, partnersResponse }: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(product.unitPrice * 2);
  const [partnerPrices, setPartnerPrices] = useState<PriceItemDto[]>([]);
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    if (partnersLoaded && partnersResponse?.items) {
      setPartnerPrices([
        ...partnersResponse.items.map((partner) => {
          const p = price && !isNaN(price) ? price : 0;
          const d = discount && !isNaN(discount) ? discount : 0;
          const discountAmount = discountType === "amount" ? roundWithPrecision(d) : roundWithPrecision((p * d) / 100);
          const discountedPrice = roundWithPrecision(p - discountAmount);
          const vatRate = Number.parseFloat(process.env.VAT_RATE);
          const commissionRate =
            roundWithPrecision(product.categoryCategoryPartners.find((c) => c.partnerId === partner.id)?.commissionRate) ?? 0;
          const commissionAmount = roundWithPrecision((discountedPrice * commissionRate) / 100);
          const shippingCost = partner.hasFreeShipping
            ? discountedPrice >= partner.freeShippingLowerLimit
              ? roundWithPrecision(partner.shippingCost)
              : 0
            : roundWithPrecision(partner.shippingCost);
          const additionalExpenses = Number.parseFloat(process.env.ADDITIONAL_EXPENSES);
          const totalVAT = roundWithPrecision((commissionAmount * vatRate) / 100 + (shippingCost * vatRate) / 100);
          return {
            partnerId: partner.id,
            price: p,
            discountAmount: discountAmount !== 0 ? -discountAmount : discountAmount,
            discountedPrice: roundWithPrecision(discountedPrice),
            unitPrice: product.unitPrice !== 0 ? -product.unitPrice : product.unitPrice,
            commissionAmount: commissionAmount !== 0 ? -commissionAmount : commissionAmount,
            shippingCost: shippingCost !== 0 ? -shippingCost : shippingCost,
            additionalExpenses: additionalExpenses !== 0 ? -additionalExpenses : additionalExpenses,
            totalVAT: totalVAT !== 0 ? -totalVAT : totalVAT,
            estimatedEarnings: roundWithPrecision(
              discountedPrice - product.unitPrice - commissionAmount - shippingCost - additionalExpenses - totalVAT
            ),
          };
        }),
      ]);
    }
  }, [partnersLoaded, partnersResponse, price, discountType, discount]);

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const modalButtons: ButtonProps[] = [
    {
      key: "ok",
      variant: "primary",
      text: "Tamam",
      disabled: false,
      loading: false,
      handleClick: handleClose,
      icon: faCircleCheck,
    },
  ];

  return (
    <>
      <Button className="btn-sm ms-1" variant="primary" onClick={handleShow}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </Button>
      <CustomModal closable handleClose={handleClose} show={show} title="Ürün Detayı" buttons={modalButtons}>
        <Container>
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
                  <FormControl placeholder="Alış Fiyatı" value={product.unitPrice} readOnly />
                  <InputGroup.Text>₺</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            {partnersLoaded ? (
              <>
                <hr />
                <Col md={12} className="text-center mb-2">
                  <h6>Fiyat Hesapla</h6>
                </Col>
                <Col md={12} className="mb-2">
                  <FormCheck
                    className="d-inline-block me-3"
                    type="radio"
                    id="infoProductModalDiscountAmountInput"
                    name="discountType"
                    label="Tutar İndirimi"
                    checked={discountType === "amount"}
                    onChange={(e) => setDiscountType("amount")}
                  />
                  <FormCheck
                    className="d-inline-block"
                    type="radio"
                    id="infoProductModalDiscountPercentInput"
                    name="discountType"
                    label="Yüzde İndirimi"
                    checked={discountType === "percent"}
                    onChange={(e) => setDiscountType("percent")}
                  />
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3" controlId="infoProductModalPriceInput">
                    <FormLabel>Satış Fiyatı</FormLabel>
                    <InputGroup>
                      <FormControl
                        type="number"
                        step="any"
                        placeholder="Fiyat Hesapla"
                        value={!isNaN(price) ? price : ""}
                        onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
                      />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3" controlId="infoProductModalDiscountInput">
                    <FormLabel>{discountType === "amount" ? "İndirim Tutarı" : "İndirim Oranı"}</FormLabel>
                    <InputGroup>
                      <FormControl
                        type="number"
                        step="any"
                        placeholder={discountType === "amount" ? "İndirim Tutarı" : "İndirim Oranı"}
                        value={!isNaN(discount) ? discount : ""}
                        onChange={(e) => setDiscount(Number.parseFloat(e.target.value))}
                      />
                      <InputGroup.Text>{discountType === "amount" ? "₺" : "%"}</InputGroup.Text>
                    </InputGroup>
                  </FormGroup>
                </Col>
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
                            className={partnerPrice.price < 0 ? "text-danger" : partnerPrice.price > 0 ? "text-success" : ""}
                          >
                            {formatCurrency(partnerPrice.price)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th>İndirim Tutarı</th>
                        {partnerPrices.map((partnerPrice) => (
                          <td
                            key={partnerPrice.partnerId}
                            className={
                              partnerPrice.discountAmount < 0 ? "text-danger" : partnerPrice.discountAmount > 0 ? "text-success" : ""
                            }
                          >
                            {formatCurrency(partnerPrice.discountAmount)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th>İndirimli Satış Fiyatı</th>
                        {partnerPrices.map((partnerPrice) => (
                          <td
                            key={partnerPrice.partnerId}
                            className={
                              partnerPrice.discountedPrice < 0 ? "text-danger" : partnerPrice.discountedPrice > 0 ? "text-success" : ""
                            }
                          >
                            {formatCurrency(partnerPrice.discountedPrice)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th>Alış Fiyatı</th>
                        {partnerPrices.map((partnerPrice) => (
                          <td
                            key={partnerPrice.partnerId}
                            className={partnerPrice.unitPrice < 0 ? "text-danger" : partnerPrice.unitPrice > 0 ? "text-success" : ""}
                          >
                            {formatCurrency(partnerPrice.unitPrice)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th>Komisyon Tutarı</th>
                        {partnerPrices.map((partnerPrice) => (
                          <td
                            key={partnerPrice.partnerId}
                            className={
                              partnerPrice.commissionAmount < 0 ? "text-danger" : partnerPrice.commissionAmount > 0 ? "text-success" : ""
                            }
                          >
                            {formatCurrency(partnerPrice.commissionAmount)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th>Kargo Ücreti</th>
                        {partnerPrices.map((partnerPrice) => (
                          <td
                            key={partnerPrice.partnerId}
                            className={partnerPrice.shippingCost < 0 ? "text-danger" : partnerPrice.shippingCost > 0 ? "text-success" : ""}
                          >
                            {formatCurrency(partnerPrice.shippingCost)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th>Toplam KDV</th>
                        {partnerPrices.map((partnerPrice) => (
                          <td
                            key={partnerPrice.partnerId}
                            className={partnerPrice.totalVAT < 0 ? "text-danger" : partnerPrice.totalVAT > 0 ? "text-success" : ""}
                          >
                            {formatCurrency(partnerPrice.totalVAT)}
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
                                ? "text-danger"
                                : partnerPrice.additionalExpenses < 0
                                ? "text-success"
                                : ""
                            }
                          >
                            {formatCurrency(partnerPrice.additionalExpenses)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th>Tahminî Kâr</th>
                        {partnerPrices.map((partnerPrice) => (
                          <td
                            key={partnerPrice.partnerId}
                            className={
                              partnerPrice.estimatedEarnings < 0 ? "text-danger" : partnerPrice.estimatedEarnings > 0 ? "text-success" : ""
                            }
                          >
                            {formatCurrency(partnerPrice.estimatedEarnings)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </>
            ) : null}
          </Row>
        </Container>
      </CustomModal>
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
  price: number;
  discountAmount: number;
  discountedPrice: number;
  unitPrice: number;
  commissionAmount: number;
  shippingCost: number;
  additionalExpenses: number;
  totalVAT: number;
  estimatedEarnings: number;
}

const roundWithPrecision = (num: number) => {
  const factor = Math.pow(10, 2);
  return Math.floor(num * factor) / factor;
};
