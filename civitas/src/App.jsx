import React from "react";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Login from "./components/Login";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Router} from "react-router-dom";
const router = createBrowserRouter (
  createRoutesFromElements(
  <>
    <Route index element = {
    <> 
      <Landing/> 
    </>}/>
    <Route path = "/login" index element = {
    <Login/>}/>
  </>)
);
function App() {
  return <RouterProvider router={router}/>
}

export default App;