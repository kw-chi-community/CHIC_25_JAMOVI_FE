import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./components/Home";
import SelectProject from "./components/SelectProject";
import CreateProject from "./components/CreateProject";

import TableTest from "./components/TableTest";

import { ChakraProvider } from "@chakra-ui/react";
import { DndContext } from "@dnd-kit/core";
import { TableDataProvider } from "./contexts/TableDataContext";

function App() {
  return (
    <ChakraProvider>
      <DndContext>
        <TableDataProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/home" element={<Home />} />
              <Route path="/project" element={<SelectProject />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/table-test" element={<TableTest />} />
            </Routes>
          </Router>
        </TableDataProvider>
      </DndContext>
    </ChakraProvider>
  );
}

export default App;
