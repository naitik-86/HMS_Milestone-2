import { LogIn, Mail, Lock, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authApi } from "../../auth/api/authApi";
import API from "../../../shared/api/axios";
import {
  getDashboardPathForRole,
  normalizeRole,
} from "../../../shared/utils/roleRedirects";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const [showVerificationModal, setShowVerificationModal] =
    useState(false);


  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const dashboardPath = getDashboardPathForRole(role);

    if (token) {
      if (localStorage.getItem("passwordResetRequired") === "true") {
        navigate("/change-password", { replace: true });
        return;
      }

      if (dashboardPath) {
        navigate(dashboardPath, { replace: true });
      }
      return;
    }

    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("passwordResetRequired");
    sessionStorage.clear();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ===========================
      // LOGIN API CALL HERE
      // ===========================

      const response = await authApi({
        email: form.email,
        password: form.password,
      });

      if (response.role !== "SUPER_ADMIN") {
        localStorage.setItem('passwordResetRequired', response.requiresPasswordReset ? 'true' : 'false');
      }

      console.log(response);


      localStorage.setItem("role", response.user?.role || response.role);
      setLoginUser(response);
      console.log(loginUser);

      setShowVerificationModal(true);
    } catch (error) {
      console.error("Login Error:", error);
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Login Failed"
      );
    }
  };

  const handleSendPhoneOtp = () => {
    if (!form.phone) {
      alert("Phone number missing");
      return;
    }

    setPhoneOtpSent(true);

    console.log("Send OTP on:", form.phone);
  };

  const handleVerifyPhoneOtp = () => {
    if (phoneOtp.length !== 6) {
      alert("Please enter a valid 6 digit OTP");
      return;
    }

    setPhoneVerified(true);
    console.log("Phone OTP Verified");
  };

  const handleSendEmailOtp = () => {
    setEmailOtpSent(true);
    console.log("Send Email OTP:", form.email);
  };

  const handleVerifyEmailOtp = () => {
    if (emailOtp.length !== 6) {
      alert("Please enter a valid 6 digit OTP");
      return;
    }

    setEmailVerified(true);
    console.log("Email OTP Verified");
  };


  const handleContinue = async () => {
    const role = localStorage.getItem("role");
    const normalizedRole = normalizeRole(role);
    let verifyEndpoint = "";
    let payload = {};

    // 1. Check conditions and prepare payload
    if (normalizedRole === "SUPER_ADMIN") {
      if (!emailVerified) return alert("Please verify Email");
      verifyEndpoint = "/auth/superadmin/verify-otp";
      payload = { email: form.email, otpEmail: emailOtp };
    } else if (normalizedRole === "CLINIC_ADMIN") {
      if (!emailVerified) return alert("Please verify Email");
      verifyEndpoint = "/auth/clinicadmin/verify-otp";
      payload = { email: form.email, otpEmail: emailOtp };
    } else {
      if (!emailVerified) return alert("Please verify Email");
      verifyEndpoint = "/auth/staff/verify-otp";
      payload = { email: form.email, otpEmail: emailOtp };
    }

    // 2. Make Verification Call & Set Token
    // 2. Make Verification Call & Set Token
    try {
      const verifyRes = await API.post(verifyEndpoint, payload);
      if (verifyRes.data?.token) {
        localStorage.setItem("token", verifyRes.data.token);

        // =========== FORCE PASSWORD LOGIC ===========
        if (verifyRes.data?.requiresPasswordReset) {
          localStorage.setItem("passwordResetRequired", "true");
          return navigate("/change-password", { replace: true });
        } else {
          localStorage.setItem("passwordResetRequired", "false");
        }
        // ============================================

      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      alert(error.response?.data?.message || "OTP Verification failed on server");
      return;
    }

    // check for plan status

    try {
      if (
        loginUser?.role === "CLINIC_ADMIN" &&
        loginUser?.user?.clinicId?.subscriptionStatus !== "ACTIVE"
      ) {
        return navigate("/payment", {
          replace: true,
          state: {
            email: loginUser?.user?.email,
            clinicId: loginUser?.user?.clinicId._id,
          },
        });
      }
    } catch (error) {
      console.warn("Error In making Payment", error);
    }


    // 3. Navigate to Dashboard with history replaced
    try {
      const redirectRes = await API.get("/dashboard");
      const redirectUrl = redirectRes.data?.data?.redirectUrl;

      if (redirectUrl) {
        return navigate(redirectUrl, { replace: true });
      }
    } catch (e) {
      console.warn("Dashboard redirect failed", e);
    }

    // Fallbacks
    const dashboardPath = getDashboardPathForRole(role);
    if (dashboardPath) {
      return navigate(dashboardPath, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {/* LOGO */}

      <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center">
        <LogIn className="w-7 h-7 text-white" />
      </div>

      <h1 className="mt-6 font-serif text-4xl font-bold text-slate-900">
        Welcome back
      </h1>

      <p className="mt-2 text-slate-500">
        Log in to your account
      </p>

      {/* LOGIN FORM */}

      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8"
      >
        {/* GOOGLE BUTTON */}

        <button
          type="button"
          className="w-full border border-slate-200 rounded-xl py-3 flex items-center justify-center gap-3 font-medium hover:bg-slate-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-500">
            OR
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* EMAIL */}

        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Email
        </label>

        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full border border-green-600 rounded-xl pl-10 pr-4 py-3 focus:outline-none"
          />
        </div>

        {/* PHONE */}

        <label className="block text-sm font-semibold text-slate-900 mt-5 mb-2">
          Phone Number
        </label>

        <div className="relative">
          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setForm({
                  ...form,
                  phone: value,
                });
              }
            }}
            placeholder="Enter phone number"
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3"
          />
        </div>

        {/* PASSWORD */}

        <div className="flex justify-between items-center mt-5 mb-2">
          <label className="text-sm font-semibold text-slate-900">
            Password
          </label>
        </div>

        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-green-600"
          />
        </div>

        <button
          type="submit"
          className="mt-7 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl"
        >
          Log in
        </button>
      </form>

      <p className="mt-7 text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-green-700 font-semibold"
        >
          Create one
        </Link>
      </p>

      {/* ================================= */}
      {/* VERIFICATION MODAL */}
      {/* ================================= */}

      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Verify Your Account
            </h2>

            <p className="text-slate-500 mt-1 mb-6">
              Complete phone and email verification
            </p>

            {/* ONLY SHOW PHONE FOR SUPER ADMIN & STAFF */}
            {localStorage.getItem("role") !== "CLINIC_ADMIN" && (
              <>
                {/* PHONE NUMBER */}
                <label className="block text-sm font-semibold mb-2">
                  Phone Number
                </label>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={form.phone}
                    readOnly
                    className="flex-1 border border-green-600 bg-slate-50 rounded-xl px-4 py-3"
                  />

                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    className="bg-green-700 hover:bg-green-800 text-white px-5 rounded-xl"
                  >
                    Send OTP
                  </button>
                </div>

                {/* PHONE OTP */}
                {phoneOtpSent && (
                  <>
                    <label className="block text-sm font-semibold mt-5 mb-2">
                      Phone OTP
                    </label>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={phoneOtp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 6) {
                            setPhoneOtp(value);
                          }
                        }}
                        placeholder="Enter 6 digit OTP"
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-3"
                      />

                      <button
                        type="button"
                        onClick={handleVerifyPhoneOtp}
                        className={`px-5 rounded-xl text-white ${phoneVerified
                          ? "bg-green-500"
                          : "bg-green-700 hover:bg-green-800"
                          }`}
                      >
                        {phoneVerified
                          ? "Verified"
                          : "Verify OTP"}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* EMAIL */}

            <div className="mt-5">
              <label className="block text-sm font-semibold mb-2">
                Email
              </label>

              <div className="flex gap-3">
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className="flex-1 border border-green-600 bg-slate-50 rounded-xl px-4 py-3"
                />

                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  className="bg-green-700 hover:bg-green-800 text-white px-5 rounded-xl"
                >
                  Send OTP
                </button>
              </div>
            </div>

            {/* EMAIL OTP */}

            {emailOtpSent && (
              <>
                <label className="block text-sm font-semibold mt-5 mb-2">
                  Email OTP
                </label>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setEmailOtp(value);
                      }
                    }}
                    placeholder="Enter 6 digit OTP"
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    className={`px-5 rounded-xl text-white ${emailVerified
                      ? "bg-green-500"
                      : "bg-green-700 hover:bg-green-800"
                      }`}
                  >
                    {emailVerified
                      ? "Verified"
                      : "Verify OTP"}
                  </button>
                </div>
              </>
            )}

            {/* CONTINUE */}

            <button
              type="button"
              onClick={handleContinue}
              className="mt-7 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl"
            >
              Verify & Continue
            </button>

            <button
              type="button"
              onClick={() =>
                setShowVerificationModal(false)
              }
              className="mt-3 w-full border border-slate-200 py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.6 6.6 29 4.7 24 4.7 13.4 4.7 4.7 13.4 4.7 24S13.4 43.3 24 43.3 43.3 34.6 43.3 24c0-1.2-.1-2.3-.3-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.6 6.6 29 4.7 24 4.7 16.6 4.7 10.2 8.9 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.3c5 0 9.5-1.9 12.9-5l-6-5c-2 1.4-4.4 2.3-6.9 2.3-5.3 0-9.7-2.9-11.3-7H6.4l-6.5 5C3.7 39.2 13 43.3 24 43.3z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2.1 3.8-3.9 5l6 5c-.4.4 6.6-4.8 6.6-14 0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
