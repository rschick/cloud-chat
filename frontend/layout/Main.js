import clsx from "clsx";

import Col from "react-bootstrap/Col";

export default function Main({ children, className }) {
  return (
    <Col className={clsx("px-0 overflow-hidden position-relative", className)}>
      {children}
    </Col>
  );
}
