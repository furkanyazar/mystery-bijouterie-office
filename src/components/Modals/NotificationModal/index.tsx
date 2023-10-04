import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { hideNotification } from "../../../store/slices/notificationSlice";

export default function index() {
  const dispatch = useAppDispatch();

  const { buttons, description, show, title, closable } = useAppSelector((c) => c.notificationItems);

  const handleClose = () => dispatch(hideNotification());

  return (
    <Modal show={show} onHide={handleClose} keyboard={closable} backdrop={closable ? undefined : "static"} scrollable>
      <Modal.Header closeButton={closable}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}</Modal.Body>
      <Modal.Footer>
        {buttons.map((button) => (
          <Button key={button.key} variant={button.variant} onClick={button.handleClick} disabled={button.disabled || button.loading}>
            {button.icon && button.iconLocation === "before" ? (
              <>
                <FontAwesomeIcon icon={button.icon} className={button.loading ? "fa-spin-pulse" : ""} />{" "}
              </>
            ) : null}
            {button.text}
            {button.icon && button.iconLocation === "after" ? (
              <>
                {" "}
                <FontAwesomeIcon icon={button.icon} className={button.loading ? "fa-spin-pulse" : ""} />
              </>
            ) : null}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  );
}
