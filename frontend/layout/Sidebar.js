import Col from "react-bootstrap/Col";

export default function Sidebar({ children }) {
  return <Col className="px-0 col-md-4">{children}</Col>;
}
