import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

export default function index({ buttons, children, closable, handleClose, show, title }: Props) {
  return (
    <Modal show={show} onHide={handleClose} keyboard={closable} backdrop={closable ? undefined : "static"} scrollable fullscreen="sm-down">
      <Modal.Header closeButton={closable}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {buttons ? (
        <Modal.Footer>
          {buttons.map((button) => (
            <Button
              key={button.key}
              type={button.type}
              form={button.form}
              variant={button.variant}
              onClick={button.handleClick}
              disabled={button.disabled}
            >
              {button.loading ? (
                <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" />
              ) : (
                <>
                  {button.icon && button.iconLocation === "before" ? <FontAwesomeIcon icon={button.icon} className="me-1" /> : null}
                  {button.text}
                  {button.icon && button.iconLocation === "after" ? <FontAwesomeIcon icon={button.icon} className="ms-1" /> : null}
                </>
              )}
            </Button>
          ))}
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}

interface Props {
  show: boolean;
  title: string;
  closable: boolean;
  buttons?: ButtonProps[];
  children: ReactNode;
  handleClose: () => void;
}

export interface ButtonProps {
  key: string;
  text: string;
  variant: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark" | "link";
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  loading: boolean;
  icon?: IconProp;
  iconLocation?: "before" | "after";
  form?: string;
  type?: "button" | "reset" | "submit";
}
