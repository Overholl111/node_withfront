import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login, SearchResult } from "./pages";

import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { fetchAuth, selectorIsAuth } from "./redux/slices/auth.js";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectorIsAuth)

  React.useEffect(() => {
    dispatch(fetchAuth());
  });

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={ <Home />} />
          <Route path="/tags/:tag" element={<SearchResult/>} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
