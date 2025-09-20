import type { JSX } from "react";
import Header from "./components/Header";
import Form from "./components/Form";
import Footer from "./components/Footer";

const App = (): JSX.Element => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Form />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
