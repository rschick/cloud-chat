import Col from "react-bootstrap/Col";

export default function Sidebar({ children }) {
  return <Col className="p-0 col-md-4">{children}</Col>;
}
