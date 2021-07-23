import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";

import Avatar from "@components/Avatar";

import auth from "@state/auth";

export default function TopNavbar() {
  return (
    <Navbar bg="light">
      <Container fluid>
        <Nav className="w-100 justify-content-end">
          <NavDropdown title={<Avatar />} align="end">
            <NavDropdown.Item onClick={() => auth.logout()}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
