import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { ConfigProvider } from "auth/configContext";
import { AuthProvider } from "auth/authContext";

const axiosMock = new axiosMockAdapter(axios);

axiosMock.onGet("/config.json").reply(200, {
  apiURL: "http://localhost:5000",
  sso: {
    url: "http://localhost:8180",
    realm: "dci-test",
    clientId: "dci",
  },
});

axiosMock.onGet("http://localhost:5000/api/v1/identity").reply(200, {
  user: {
    created_at: "2017-02-20T10:43:25.326282",
    email: "u1@redhat.com",
    etag: "191539996cb96d416cd386558de5d499",
    fullname: "First User",
    id: "a48ecab4-01d0-97d9-4f45-f7b938808e23",
    name: "u1",
    remotecis: [],
    sso_username: null,
    state: "active",
    team: {
      country: null,
      created_at: "2018-01-31T12:48:32.002566",
      etag: "eede9f2b2f0e31dead1589748a6d308c",
      external: false,
      id: "03485867-d100-aab2-46a0-d4dd4d9ed18d",
      name: "First Team",
      parent_id: "31c5b2cb-5ff0-4f1f-9356-133755712ba7",
      state: "active",
      updated_at: "2018-07-21T09:10:13.944221",
    },
    team_id: "03485867-d100-aab2-46a0-d4dd4d9ed18d",
    timezone: "Europe/Paris",
    updated_at: "2018-07-23T10:30:39.171087",
  },
});

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <ConfigProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
