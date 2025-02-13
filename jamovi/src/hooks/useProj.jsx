// src/hooks/useProj.jsx
import { useState } from "react";

/**
 * useProj 커스텀 훅
 *
 * 프로젝트 목록을 가져오고, 새로운 프로젝트를 생성하는 기능을 제공합니다.
 */
const useProj = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 프로젝트 목록을 백엔드에서 가져옵니다.
   * @returns {Promise<void>}
   */
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        throw new Error("데이터 형식이 올바르지 않습니다.");
      }
    } catch (err) {
      setError(err.message || "프로젝트를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 새로운 프로젝트를 생성합니다.
   * @param {Object} projectData - 생성할 프로젝트의 데이터
   * @param {string} projectData.name - 프로젝트 이름
   * @param {string} [projectData.description] - 프로젝트 설명
   * @returns {Promise<Object>} 생성된 프로젝트 데이터
   */
  const createProject = async ({ name, description = "" }) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, description }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const newProject = await response.json();
      setProjects((prevProjects) => [...prevProjects, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message || "프로젝트를 생성하는 중 오류가 발생했습니다.");
      throw err; // 호출자에게 오류를 전달
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
  };
};

export default useProj;
