import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginUser } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../utils/toast.js";
import { Link } from "react-router-dom";
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      if (!response.success) {
        showError(response.message);
      }
      showSuccess(response.message);
      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.id,
          userName: response.userName,
          email: response.email,
          role: response.role,
        }),
      );

      if (response.role === "admin") {
        navigate("/admin");
      } else if (response.role === "employee") {
        navigate("/employee");
      } else if (
        [
          "IT_dept_Agent",
          "HR_dept_Agent",
          "Finance_dept_agent",
          "Admin_dept_Agent",
        ].includes(response.role)
      ) {
        navigate("/agent");
      } else {
        navigate("/register");
      }
    } catch (err) {
      console.log(err);
      showError(err?.response?.data?.message );
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              className="card-header text-center py-4"
              style={{
                background: "#FFF8E1",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <h3 className="fw-bold text-dark mb-2">
                Internal Ticket Management System{" "}
              </h3>
              <p className="text-muted mb-0">
                Sign in to access your dashboard and manage support requests
              </p>
            </div>

            {/* Body */}
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope"></i>
                    </span>

                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="name@company.com"
                      {...register("email", {
                        required: "Email address is required",
                        pattern: {
                          value:
                            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </div>

                  <div className="text-danger small mt-1">
                    {errors.email?.message}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock"></i>
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                  </div>

                  <div className="text-danger small mt-1">
                    {errors.password?.message}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn w-100 py-2 fw-semibold"
                  style={{
                    backgroundColor: "#F59E0B",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Sign In
                </button>

                {/* Footer */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    Don't have an account?
                    <Link
                      to="/register"
                      className="fw-semibold text-decoration-none ms-1"
                      style={{ color: "#F59E0B" }}
                    >
                      Create Account
                    </Link>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
