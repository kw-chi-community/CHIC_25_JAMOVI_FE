import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import DataTable from "./DataTable";
import OptionForm from "./OptionForm";
import Result from "./Result";
import LoadingSpinner from "./LoadingSpinner";

const Home = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading || !isLoggedIn) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full min-h-screen flex bg-gray-50">
      <div className="w-1/2 min-h-full flex flex-col justify-between">
        <DataTable />
        <OptionForm />
      </div>
      <div className="w-1/2 min-h-full">
        <Result />
      </div>
      <div></div>
    </div>
  );
};

export default Home;
