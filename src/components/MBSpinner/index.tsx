import { Spinner } from "react-bootstrap";

export default function index() {
  return (
    <div className="p-3 text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
