import { Fragment, type JSX } from "react";
import Header from "./components/Header";
import Form from "./components/Form";
import Footer from "./components/Footer";

const App = (): JSX.Element => {
  return (
    <Fragment>
      <Header />
      <Form />
      <Footer />
    </Fragment>
  );
};

export default App;
