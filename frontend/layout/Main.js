import Col from "react-bootstrap/Col";

export default function Main({ children }) {
  return <Col className="px-0 overflow-hidden">{children}</Col>;
}
