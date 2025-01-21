import { useState, useEffect } from "react";

/**
 * 로그인 상태, 유저 이메일, 로딩 상태를 관리하는 훅
 * @returns {Object} 로그인 상태(bool), 유저 이메일(@ 앞부분, str), 로딩 상태(bool), 로그인 함수, 로그아웃 함수
 */
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo(token);
    }
  }, []);

  /**
   * 유저 이메일(이름대용?, @ 앞부분)을 서버에서 가져오는 함수
   * @param {string} token - 로컬스토리지에 저장된 토큰
   * @returns {Promise<void>} 성공 -> userEmail에 받아온 이메일(@ 앞부분) 넣음. 실패-> 로그아웃(토큰제거)
   */
  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email);
      } else {
        console.error("Failed to fetch user info");
        handleLogout();
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserEmail("");
  };

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    fetchUserInfo(token);
  };

  return {
    isLoggedIn,
    userEmail,
    isLoading,
    setIsLoading,
    handleLogin,
    handleLogout,
  };
};
