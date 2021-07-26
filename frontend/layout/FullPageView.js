import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function FullPageView({ children }) {
  return (
    <Container fluid>
      <Row>{children}</Row>
    </Container>
  );
}
