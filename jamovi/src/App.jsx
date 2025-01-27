import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./components/Home";

import { ChakraProvider } from "@chakra-ui/react";
import { DndContext } from "@dnd-kit/core";

function App() {
  return (
    <ChakraProvider>
      <DndContext>
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </DndContext>
    </ChakraProvider>
  );
}

export default App;
