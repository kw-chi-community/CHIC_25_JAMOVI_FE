import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSearchParams, useNavigate } from "react-router-dom";
import useProj from "../hooks/useProj";
import DataTable from "./DataTable";
import OptionForm from "./OptionForm";
import Result from "./Result";
import LoadingSpinner from "./LoadingSpinner";

const Home = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { getProject, isLoading: projLoading } = useProj();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("id");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (projectId) {
        try {
          const projectData = await getProject(projectId);
          console.log("project name:", projectData.name);
          document.title = `Stat Bee | ${projectData.name}`;
        } catch (error) {
          console.error("err fetching project", error);
        }
      } else {
        navigate("/project");
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate, getProject]);

  if (authLoading || projLoading || !isLoggedIn) {
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
