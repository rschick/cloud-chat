import clsx from "clsx";

import Col from "react-bootstrap/Col";

export default function Main({ children, className, selected }) {
  return (
    <Col
      className={clsx(
        "px-0 overflow-hidden position-relative d-md-block",
        !selected && "d-none",
        className
      )}
    >
      {children}
    </Col>
  );
}
