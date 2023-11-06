import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { hideNotification } from "../../../store/slices/notificationSlice";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function index() {
  const dispatch = useAppDispatch();

  const { buttons, description, show, title, closable } = useAppSelector((c) => c.notificationItems);

  const handleClose = () => dispatch(hideNotification());

  return (
    <Modal show={show} onHide={handleClose} keyboard={closable} backdrop={closable ? undefined : "static"} scrollable fullscreen="sm-down">
      <Modal.Header closeButton={closable}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}</Modal.Body>
      <Modal.Footer>
        {buttons.map((button) => (
          <Button key={button.key} variant={button.variant} onClick={button.handleClick} disabled={button.disabled}>
            {button.loading ? (
              <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" />
            ) : (
              <>
                {button.icon && <FontAwesomeIcon icon={button.icon} className="me-1" />}
                {button.text}
              </>
            )}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  );
}
