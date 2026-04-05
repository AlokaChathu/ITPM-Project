import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import NewLogo from "../assets/TalenTracerLogo2.png";
import BgImg from "../assets/BackgrounMain.jpg";
import PasswordStatus from '../pages/SignUp/PasswordStatus';
import InputField from '../pages/InputField';

import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { getUserData } = useContext(AppContent);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});

  const checks = useMemo(() => {
    return {
      minLen: password.length >= 6,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const score = useMemo(() => {
    return Object.values(checks).filter(Boolean).length;
  }, [checks]);

  const isValidPassword = score === 5;

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        const nameRegex = /^[A-Za-z\s]{5,20}$/;
        return nameRegex.test(value);
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      case 'password':
        return isValidPassword;
      case 'age':
        return value && !isNaN(value) && value >= 1 && value <= 120;
      case 'phone':
        return value && value.trim().length > 0;
      case 'address':
        return value && value.trim().length > 0;
      default:
        return true;
    }
  };

  const getFieldError = (field, value) => {
    if (!touchedFields[field]) return null;
    
    switch (field) {
      case 'name':
        if (!value) return "Name is required";
        if (!/^[A-Za-z\s]{5,20}$/.test(value)) return "Name must be 5-20 alphabetic characters";
        return null;
      case 'email':
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
        return null;
      case 'age':
        if (!value) return "Age is required";
        if (isNaN(value) || value < 1) return "Please enter a valid age (1-120)";
        if (value > 120) return "Please enter a valid age (1-120)";
        return null;
      case 'phone':
        if (!value) return "Phone number is required";
        return null;
      case 'address':
        if (!value) return "Address is required";
        return null;
      default:
        return null;
    }
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const fillLoginDemo = () => {
    setState("Login");
    setEmail("student1@gmail.com");
    setPassword("student123");
    setTouchedFields({ email: true, password: true });
  };

  const fillSignupDemo = () => {
    setState("Sign Up");
    setName("Demo Candidate");
    setEmail("demo.signup@talenttracer.com");
    setPassword("Demo@123");
    setAge("25");
    setPhone("1234567890");
    setAddress("123 Demo Street, City");
    setTouchedFields({
      name: true,
      email: true,
      password: true,
      age: true,
      phone: true,
      address: true,
    });
  };

  const validateForm = () => {
    if (state === "Sign Up") {
      const fields = ['name', 'email', 'password', 'age', 'phone', 'address'];
      let isValid = true;
      
      fields.forEach(field => {
        let value;
        switch (field) {
          case 'name': value = name; break;
          case 'email': value = email; break;
          case 'password': value = password; break;
          case 'age': value = age; break;
          case 'phone': value = phone; break;
          case 'address': value = address; break;
          default: value = '';
        }
        
        if (!validateField(field, value)) {
          isValid = false;
          setTouchedFields(prev => ({ ...prev, [field]: true }));
        }
      });
      
      if (!isValid) {
        toast.error("Please fix the errors in the form");
        return false;
      }
    } else {
      if (!email || !password) {
        toast.error("Email and password are required");
        setTouchedFields(prev => ({ ...prev, email: !email, password: !password }));
        return false;
      }
      
      if (!validateField('email', email)) {
        toast.error("Invalid email address");
        setTouchedFields(prev => ({ ...prev, email: true }));
        return false;
      }
    }

    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    axios.defaults.withCredentials = true;

    try {
      setIsLoading(true);

      const url =
        state === "Sign Up"
          ? "http://localhost:4000/api/auth/register"
          : "http://localhost:4000/api/auth/login";

      const payload =
        state === "Sign Up"
          ? { name, email, password, age, phone, address }
          : { email, password };

      const { data } = await axios.post(url, payload);
      setIsLoading(false);

      if (data.success) {
        toast.success(state === "Sign Up" ? "Account created successfully!" : "Login successful!");
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background with enhanced gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BgImg})` }}
      />
      <div className="absolute inset-0  backdrop-blur-md" />
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Logo with enhanced styling */}
      <div className="absolute top-6 left-6 z-20 group cursor-pointer" onClick={() => navigate("/")}>
        <div className="relative">
          <div className=" absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/30 transition-all duration-300" />
          <img
            src={NewLogo}
            alt="TalentTracer"
            className="2xl:ml-20 relative w-28 h-auto cursor-pointer transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Main Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-8
        bg-white/90 backdrop-blur-xl border border-slate-200
        shadow-2xl transition-all duration-300 hover:shadow-indigo-500/15
        animate-fadeInUp text-slate-800 mt-20 mb-20"
      >
      

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-slate-600">
            {state === "Sign Up"
              ? "Join TalentTracer and start your journey"
              : "Sign in to access your dashboard"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === "Sign Up" && (
            <div className="transform transition-all duration-200">
              <InputField
                Icon={User}
                placeholder="Full Name"
                value={name}
                onChange={setName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => handleBlur('name')}
                error={getFieldError('name', name)}
                touched={touchedFields.name}
              />
            </div>
          )}

          <div className="transform transition-all duration-200">
            <InputField
              Icon={Mail}
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => handleBlur('email')}
              error={getFieldError('email', email)}
              touched={touchedFields.email}
            />
          </div>

          <div className="relative transform transition-all duration-200">
            <div className="relative">
              <InputField
                Icon={Lock}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => handleBlur('password')}
                error={state === "Sign Up" && touchedFields.password && !isValidPassword ? "Password must meet all requirements" : null}
                touched={touchedFields.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {state === "Sign Up" && password && (
            <div className="animate-slideDown">
              <PasswordStatus checks={checks} password={password} score={score} />
            </div>
          )}

          {state === "Sign Up" && (
            <>
              <div className="transform transition-all duration-200">
                <InputField
                  Icon={Calendar}
                  placeholder="Age"
                  type="number"
                  value={age}
                  onChange={setAge}
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => handleBlur('age')}
                  error={getFieldError('age', age)}
                  touched={touchedFields.age}
                />
              </div>

              <div className="transform transition-all duration-200">
                <InputField
                  Icon={Phone}
                  placeholder="Phone Number"
                  value={phone}
                  onChange={setPhone}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => handleBlur('phone')}
                  error={getFieldError('phone', phone)}
                  touched={touchedFields.phone}
                />
              </div>

              <div className="transform transition-all duration-200">
                <InputField
                  Icon={MapPin}
                  placeholder="Address"
                  value={address}
                  onChange={setAddress}
                  onFocus={() => setFocusedField('address')}
                  onBlur={() => handleBlur('address')}
                  error={getFieldError('address', address)}
                  touched={touchedFields.address}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={fillLoginDemo}
              className="w-full rounded-lg border border-indigo-200 bg-white/70 text-indigo-700 font-semibold py-2.5 shadow-sm hover:border-indigo-300 hover:bg-white transition"
            >
              Demo Sign In
            </button>
            <button
              type="button"
              onClick={fillSignupDemo}
              className="w-full rounded-lg border border-emerald-200 bg-white/70 text-emerald-700 font-semibold py-2.5 shadow-sm hover:border-emerald-300 hover:bg-white transition"
            >
              Demo Sign Up
            </button>
          </div>

          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer text-right transition-colors"
            >
              Forgot password?
            </p>
          )}

          <button
            type="submit"
            className="group relative w-full py-3.5 rounded-xl
            bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600
            hover:from-indigo-700 hover:via-indigo-700 hover:to-blue-700
            transform hover:scale-[1.01] transition-all duration-300 
            font-semibold text-white shadow-lg hover:shadow-indigo-500/25
            overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {state === "Sign Up" ? "Create Account" : "Sign In"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </form>

        {/* Toggle between Login/Signup */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            {state === "Sign Up"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setState(state === "Sign Up" ? "Login" : "Sign Up");
                setTouchedFields({});
              }}
              className="text-indigo-700 hover:text-indigo-600 font-semibold underline-offset-2 hover:underline transition-all"
            >
              {state === "Sign Up" ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>

        {/* Admin Login Link */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-slate-500">
            Staff member?{" "}
            <button
              onClick={() => navigate("/admin/login")}
              className="text-indigo-700 hover:text-indigo-600 font-semibold transition-colors inline-flex items-center gap-1"
            >
              <Shield size={12} />
              Admin Portal
            </button>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <CheckCircle2 size={12} />
          <span>Secure & Encrypted</span>
          <span className="w-1 h-1 bg-gray-500 rounded-full" />
          <span>24/7 Support</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;