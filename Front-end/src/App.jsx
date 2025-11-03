import React from "react";
import { Route, Routes } from "react-router-dom";
import { myRoutes, PrivateLayout } from "./Routes"

const App = () => {
  return (
   <Routes>
    {myRoutes.map((routes,index)=>(
      <Route
      key={index}
      path={routes.path}
      element={<routes.component />}
 /> 
 ))}
 {PrivateLayout.map((route,index)=>(
   <Route
   key={index}
    path={route.path}
    element={<route.Layout><route.component /></route.Layout>}
   />
 ))}
   </Routes>
  );
};

export default App;
