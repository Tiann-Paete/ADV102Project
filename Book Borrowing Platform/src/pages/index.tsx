import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import app from "../Firebase/firebaseConfig";
import { FirebaseError } from "@firebase/util";

interface IFormInput {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<IFormInput>();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const auth = getAuth(app);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      await router.push("/home");
    } catch (error) {
      console.error("Error signing in:", error);

      if (isFirebaseError(error)) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Incorrect email or password.",
          confirmButtonColor: "#20549E",
          confirmButtonText: "Ok",
        });
      } 
    }
  };

  const isFirebaseError = (error: any): error is FirebaseError => {
    return (error as FirebaseError).code !== undefined;
  };

  return (
    <main>
      <div className="h-[100vh] flex items-center justify-center px-5 lg:px-0 bg-gradient-to-t from-zinc-50 via-sky-700 to-indigo-900">
        <div className="max-w-md w-full bg-white border-gray-300 shadow sm:rounded-lg">
          <div className="p-6 sm:p-12">
            <div className="flex flex-col items-center">
              <div className="text-center">
                <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                  Welcome back!
                </h1>
                <p className="text-[12px] text-gray-500 mt-4">
                  Sign in to your account
                </p>
              </div>
              <form className="w-full flex-1 mt-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="mx-auto max-w-xs flex flex-col gap-4">
                  <input
                    {...register("email", {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                    })}
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 
                    text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <div className="relative">
                    <input
                      {...register("password", { required: true, minLength: 8 })}
                      className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 
                      text-sm focus:outline-none focus:border-gray-400 focus:bg-white pr-10"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 mt-3 mr-3 text-gray-500"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-800 
                    transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Sign In</span>
                  </button>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    Don't have an account?{" "}
                    <a href="register">
                      <span className="text-blue-900 font-semibold">Sign up</span>
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
