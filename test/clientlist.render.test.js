import ClientList from "../src/views/Client/ClientList";

import React from "react";

import { render, cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

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


afterEach(cleanup);

test("<ClientList /> renders correctly", () => {
  clients.mockResolvedValueOnce(clientsDataMock);

  const { asFragment } = render(
    <Router>
      <ClientList />
    </Router>
  );

  expect(
    asFragment(
      <Router>
        <ClientList />
      </Router>
    )
  ).toMatchSnapshot();
});
