// src/hooks/useProj.jsx
import { useState, useEffect, useCallback } from "react";

/**
 * useProj 커스텀 훅
 *
 * 프로젝트 데이터를 불러오고 상태를 관리합니다.
 *
 * @returns {Object} - 프로젝트 목록, 로딩 상태, 오류 상태, 다시 시도 함수
 */
const useProj = () => {
  const [projects, setProjects] = useState([]); // 프로젝트 목록 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // 프로젝트 데이터를 불러오는 함수
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 로그인해주세요.");
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

      // 데이터가 배열인지 확인하고 상태 업데이트
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
  }, []);

  // 컴포넌트 마운트 시 프로젝트 데이터 불러오기
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, error, fetchProjects };
};

export default useProj;
