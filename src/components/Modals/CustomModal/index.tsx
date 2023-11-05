import { ReactNode } from "react";
import { Modal } from "react-bootstrap";

export default function index({ childrenBody, childrenFooter, title }: Props) {
  return (
    <Modal>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{childrenBody}</Modal.Body>
      <Modal.Footer>{childrenFooter}</Modal.Footer>
    </Modal>
  );
}

interface Props {
  title: string;
  childrenBody: ReactNode;
  childrenFooter: ReactNode;
}
