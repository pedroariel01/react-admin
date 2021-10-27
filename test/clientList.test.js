import ClientList from "../src/views/Client/ClientList";

import React from "react";

import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

afterEach(cleanup);

import { clients } from "../src/api/clients";

jest.mock("../src/api/clients");

const clientsDataMock = [
  {
    id: 1,
    association: [1, 2, 3, 4, 48],
    name: "SEATTLE",
    client_url: null,
    confluence_pages_urls: "",
    description: "Seattle Client",
    created_on: "2020-04-24T21:07:41.540798Z",
    notes: null
  },
  {
    id: 123,
    association: [40],
    name: "LONGVIEW",
    client_url: null,
    confluence_pages_urls: null,
    description: null,
    created_on: "2020-04-27T00:00:00Z",
    notes: null
  }
];

it("<ClientList/> renders data", async () => {
  clients.mockResolvedValueOnce(clientsDataMock);

  // render(
  //   <Router>
  //     <ClientList />
  //   </Router>
  // );
  const { asFragment } = render(
    <Router>
      <ClientList />
    </Router>
  );

  expect(clients).toHaveBeenCalledTimes(1);
  expect(clients).toHaveBeenCalledWith();
  await waitFor(() =>
    expect(screen.getByText("Connectors count")).toBeInTheDocument()
  );
  clientsDataMock.forEach(client => {
    expect(screen.getByText(client.name)).toBeInTheDocument();
  });

  expect(
    asFragment(
      <Router>
        <ClientList />
      </Router>
    )
  ).toMatchSnapshot();

});
