import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import AppRoutes from "./routers/AppRoutes";
import store from "./store/configureStore";

export const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <CssBaseline>
        <AppRoutes />
      </CssBaseline>
    </BrowserRouter>
  </Provider>
);

export default App;
