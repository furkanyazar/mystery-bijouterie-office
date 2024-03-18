import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import MBModal, { ButtonProps } from "../../../../components/Modals/MBModal";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import GetByIdCategoryResponse from "../../../../http/categories/models/queries/getById/getByIdCategoryResponse";

export default function index({ category }: Props) {
  const [show, setShow] = useState<boolean>(false);

  const { partners } = useAppSelector((state) => state.appItems);

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
      <MBModal
        id={`infoCategoryModal-${category.id}`}
        closable
        handleClose={handleClose}
        show={show}
        title="Kategori Detayı"
        buttons={modalButtons}
      >
        <Container>
          <Row>
            <Col md={12}>
              <FormGroup className="mb-3" controlId="infoCategoryModalNameInput">
                <FormLabel>Ad</FormLabel>
                <FormControl placeholder="Ad" value={category.name} readOnly />
              </FormGroup>
            </Col>
            {partners.map((partner) => (
              <Col key={partner.id} md={6}>
                <FormGroup className="mb-3" controlId={"infoCategoryModalPartnerInput-" + partner.id}>
                  <FormLabel>{partner.name} Komisyon O.</FormLabel>
                  <FormControl
                    placeholder={partner.name + " Komisyon O."}
                    value={category.categoryPartners?.find((cp) => cp.partnerId === partner.id)?.commissionRate ?? ""}
                    readOnly
                  />
                </FormGroup>
              </Col>
            ))}
          </Row>
        </Container>
      </MBModal>
    </>
  );
}

interface Props {
  category: GetByIdCategoryResponse;
}
