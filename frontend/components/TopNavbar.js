import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useSnapshot } from "valtio";

import Avatar from "@components/Avatar";

import auth from "@state/auth";
import messages from "@state/messages";

export default function TopNavbar() {
  const { user } = useSnapshot(auth);
  const { selectedConversation } = useSnapshot(messages);

  return (
    <Navbar bg="light" className="border-bottom">
      <Container fluid>
        <Navbar.Text className="flex-grow-1 text-center">
          {selectedConversation ? selectedConversation.value.title : ""}
        </Navbar.Text>
        <Nav>
          <NavDropdown title={<Avatar />} align="end">
            <NavDropdown.Item>{user.name}</NavDropdown.Item>
            <NavDropdown.Item onClick={() => auth.logout()}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
