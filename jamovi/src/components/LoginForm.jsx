import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import { Input } from "@chakra-ui/react";
import { Button } from "../components/ui/button";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // 사용자 이메일 상태 추가
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo(token);
    }
  }, []);

  /**
   * 사용자 정보를 가져옴
   * @param {string} token - 사용자 토큰
   * @returns {Promise<void>} - user_id, email(@ 앞부분)
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      setIsLoading(false);
      return;
    }

    // 비밀번호 유효성 검사
    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      setIsLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        username: formData.email,
        password: formData.password,
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          localStorage.setItem("token", data.token);
          setError("");
          navigate("/home");
        } else {
          setError("이메일과 비밀번호를 확인해주세요.");
        }
      } else {
        setError(data.detail || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
      console.error("handle submit\n", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {isLoggedIn ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              {userEmail ? `${userEmail}님으로 로그인되었습니다.` : ""}
            </h2>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => navigate("/home")}>
                홈으로 이동
              </Button>
              <Button onClick={handleLogout} colorScheme="red">
                로그아웃
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                로그인
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  이메일
                </label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  비밀번호
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => navigate("/register")}
                >
                  회원가입
                </Button>
                <Button type="submit" loading={isLoading} colorScheme="blue">
                  로그인
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
