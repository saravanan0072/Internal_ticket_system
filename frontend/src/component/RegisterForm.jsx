import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerUser } from "../api/api.js";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await registerUser(data);
      reset();
      navigate("/login")
      console.log(response);

      // alert(response.message);
    } catch (err) {
      console.log(err);
      // alert("Registration failed");
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
                Internal Ticket Management System
              </h3>

              <p className="text-muted mb-0">
                Create your account to securely access the platform
              </p>
            </div>

            {/* Body */}
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-person"></i>
                    </span>

                    <input
                      type="text"
                      className={`form-control ${
                        errors.userName ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your full name"
                      {...register("userName", {
                        required: "Username is required",
                        maxLength: {
                          value: 30,
                          message: "Maximum 30 characters allowed",
                        },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Only letters are allowed",
                        },
                      })}
                    />
                  </div>

                  <div className="text-danger small mt-1">
                    {errors.userName?.message}
                  </div>
                </div>

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
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                  </div>

                  <div className="text-danger small mt-1">
                    {errors.email?.message}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
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
                      placeholder="Create a secure password"
                      {...register("password", {
                        required: "Password is required",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                          message:
                            "Must contain uppercase, lowercase, number and special character",
                        },
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

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-shield-lock"></i>
                    </span>

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      placeholder="Re-enter password"
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <i
                        className={`bi ${
                          showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                  </div>

                  <div className="text-danger small mt-1">
                    {errors.confirmPassword?.message}
                  </div>
                </div>

                {/* Role */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Account Type</label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-person-badge"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      value="Employee"
                      readOnly
                      {...register("role")}
                    />
                  </div>

                  <small className="text-muted">
                    New accounts are registered as Employees. Department Agent
                    roles are assigned by administrators after approval.
                  </small>
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
                  Create Account
                </button>

                {/* Footer */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    Already have an account?
                    <a
                      href="/login"
                      className="fw-semibold text-decoration-none ms-1"
                      style={{ color: "#F59E0B" }}
                    >
                      Sign In
                    </a>
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

export default RegisterForm;
