import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import { Input } from "@chakra-ui/react";
import { Button } from "../components/ui/button";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "", // 비밀번호 확인 필드 추가
    verificationCode: ["", "", "", "", "", ""],
  });
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // 사용자 이메일 상태 추가
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const verificationInputRefs = Array(6)
    .fill()
    .map(() => React.createRef());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

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

    // 비밀번호 일치 검사
    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      const requestData = {
        email: formData.email,
        password: formData.password,
        verification_code: formData.verificationCode.join(""),
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setError("");
        navigate("/home");
      } else {
        setError("이미 회원가입이 되어있어요.");
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
      console.error("handle submit\n", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!formData.email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    setIsVerifying(true);
    setVerificationStatus("전송중...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/send-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setVerificationStatus("전송됨");
        setError("");
      } else {
        setVerificationStatus("");
        if (data.detail === "Email already registered") {
          setError("이미 등록된 이메일입니다.");
        } else {
          setError("인증 메일 전송에 실패했습니다. 다시 시도해주세요.");
        }
      }
    } catch (err) {
      setVerificationStatus("");
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
      console.error("verification email send error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerificationCodeChange = (index, value) => {
    const newValue = value.replace(/[^0-9]/g, "");

    if (newValue.length <= 1) {
      const newVerificationCode = [...formData.verificationCode];
      newVerificationCode[index] = newValue;

      setFormData((prev) => ({
        ...prev,
        verificationCode: newVerificationCode,
      }));

      if (newValue.length === 1 && index < 5) {
        verificationInputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      index > 0 &&
      formData.verificationCode[index] === ""
    ) {
      verificationInputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);

    if (pastedText.length > 0) {
      const newVerificationCode = Array(6).fill("");
      [...pastedText].forEach((char, index) => {
        if (index < 6) newVerificationCode[index] = char;
      });

      setFormData((prev) => ({
        ...prev,
        verificationCode: newVerificationCode,
      }));

      const nextIndex = Math.min(pastedText.length, 5);
      verificationInputRefs[nextIndex].current.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            회원가입
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
            <div className="flex gap-2">
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
              />
              <Button
                type="button"
                onClick={handleSendVerification}
                disabled={isVerifying}
              >
                {verificationStatus || "인증메일 전송"}
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              인증메일
            </label>
            <div className="flex gap-2 justify-between">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <Input
                  key={index}
                  ref={verificationInputRefs[index]}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl"
                  value={formData.verificationCode[index]}
                  onChange={(e) =>
                    handleVerificationCodeChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                />
              ))}
            </div>
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
            <div className="mt-2" />

            <Input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              disabled={isLoading}
              onClick={() => navigate("/login")}
            >
              로그인으로 이동
            </Button>
            <Button type="submit" loading={isLoading} colorScheme="blue">
              회원가입
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
