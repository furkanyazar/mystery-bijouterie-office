import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faInfoCircle, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, InputGroup, Row, Table } from "react-bootstrap";
import ModalImage from "react-modal-image";
import MBTextEditor from "../../../../components/MBTextEditor";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { formatCurrency } from "../../../../functions";
import GetListPartnerListItemDto from "../../../../http/partners/models/queries/getList/getListPartnerListItemDto";
import GetByIdProductResponse from "../../../../http/products/models/queries/getById/getByIdProductResponse";
import GetListResponse from "../../../../models/getListResponse";

export default function index({ product, partnersLoaded, partnersResponse }: Props) {
  const defaultImageUrl = process.env.DEFAULT_IMAGE_URL;

  const [show, setShow] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(product.unitPrice * 2);
  const [partnerPrices, setPartnerPrices] = useState<PriceItemDto[]>([]);
  const [discounts, setDiscounts] = useState<DiscountItemDto[]>([]);

  useEffect(() => {
    if (partnersLoaded && partnersResponse?.items) {
      setPartnerPrices([
        ...partnersResponse.items.map((partner) => {
          const p = price && !isNaN(price) ? price : 0;
          let discountedPrice = p;
          const d: number[] = [];
          discounts.forEach((discount) => {
            let dis = discount && !isNaN(discount.amount) ? discount.amount : 0;
            let dist = discount.type === "amount" ? roundWithPrecision(dis) : roundWithPrecision((discountedPrice * dis) / 100);
            discountedPrice -= dist;
            d.push(dist !== 0 ? -dist : dist);
          });
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
          const totalVAT =
            roundWithPrecision((commissionAmount * vatRate) / 100 + (shippingCost * vatRate) / 100) + (partner.serviceFee * vatRate) / 100;
          return {
            partnerId: partner.id,
            price: p,
            discountedPrice: roundWithPrecision(discountedPrice),
            unitPrice: product.unitPrice !== 0 ? -product.unitPrice : product.unitPrice,
            commissionAmount: commissionAmount !== 0 ? -commissionAmount : commissionAmount,
            shippingCost: shippingCost !== 0 ? -shippingCost : shippingCost,
            additionalExpenses: additionalExpenses !== 0 ? -additionalExpenses : additionalExpenses,
            totalVAT: totalVAT !== 0 ? -totalVAT : totalVAT,
            estimatedEarnings: roundWithPrecision(
              discountedPrice - product.unitPrice - commissionAmount - shippingCost - additionalExpenses - totalVAT
            ),
            discounts: d,
            serviceFee: partner.serviceFee !== 0 ? -partner.serviceFee : partner.serviceFee,
          };
        }),
      ]);
    }
  }, [partnersLoaded, partnersResponse, price, discounts]);

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
      <MBModal closable handleClose={handleClose} show={show} title="Ürün Detayı" buttons={modalButtons} size="xl">
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
                      <FormControl placeholder="Alış Fiyatı" value={product.unitPrice} readOnly />
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
          {partnersLoaded && (
            <>
              <hr />
              <Row>
                <Col md={12} className="text-center mb-2">
                  <h5>Fiyat Hesapla</h5>
                </Col>
                <Col md={12} lg={4}>
                  <Row>
                    <Col xs={6}>
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
                    <Col xs={6} className="mb-3">
                      <FormLabel>İndirimler</FormLabel>
                      <br />
                      <Button
                        variant="success"
                        onClick={() => setDiscounts((prev) => [...prev, { id: ++currentDiscountId, type: "amount", amount: 0 }])}
                      >
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
                                setDiscounts((prev) => [
                                  ...prev.map((p) => ({ ...p, type: discount.id === p.id ? e.target.value : p.type })),
                                ]);
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
                                setDiscounts((prev) => [
                                  ...prev.map((p) => ({ ...p, type: discount.id === p.id ? e.target.value : p.type })),
                                ]);
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
                                onChange={(e: any) => {
                                  setDiscounts((prev) => [
                                    ...prev.map((p) => ({ ...p, amount: discount.id === p.id ? e.target.value : p.amount })),
                                  ]);
                                }}
                              />
                              <InputGroup.Text>{discount.type === "amount" ? "₺" : "%"}</InputGroup.Text>
                              <Button
                                variant="danger"
                                onClick={() => setDiscounts((prev) => [...prev.filter((p) => p.id !== discount.id)])}
                              >
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
                                className={partnerPrice.price < 0 ? "text-danger" : partnerPrice.price > 0 ? "text-success" : ""}
                              >
                                {formatCurrency(partnerPrice.price)}
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
                                    partnerPrice.discounts[index] < 0
                                      ? "text-danger"
                                      : partnerPrice.discounts[index] > 0
                                      ? "text-success"
                                      : ""
                                  }
                                >
                                  {formatCurrency(partnerPrice.discounts[index])}
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
                                  partnerPrice.commissionAmount < 0
                                    ? "text-danger"
                                    : partnerPrice.commissionAmount > 0
                                    ? "text-success"
                                    : ""
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
                                className={
                                  partnerPrice.shippingCost < 0 ? "text-danger" : partnerPrice.shippingCost > 0 ? "text-success" : ""
                                }
                              >
                                {formatCurrency(partnerPrice.shippingCost)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <th>Hizmet Bedeli</th>
                            {partnerPrices.map((partnerPrice) => (
                              <td
                                key={partnerPrice.partnerId}
                                className={partnerPrice.serviceFee < 0 ? "text-danger" : partnerPrice.serviceFee > 0 ? "text-success" : ""}
                              >
                                {formatCurrency(partnerPrice.serviceFee)}
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
  price: number;
  discountedPrice: number;
  unitPrice: number;
  commissionAmount: number;
  shippingCost: number;
  additionalExpenses: number;
  totalVAT: number;
  estimatedEarnings: number;
  discounts: number[];
  serviceFee: number;
}

interface DiscountItemDto {
  id: number;
  type: "amount" | "percent";
  amount: number;
}

const roundWithPrecision = (num: number) => {
  const factor = Math.pow(10, 2);
  return Math.floor(num * factor) / factor;
};

let currentDiscountId = 0;
