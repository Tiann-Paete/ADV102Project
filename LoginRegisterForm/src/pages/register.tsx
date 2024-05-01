import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../Firebase/firebaseConfig"; 

interface IFormInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<IFormInput>();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const userRef = collection(db, "users");
      await addDoc(userRef, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        userId: userCredential.user.uid,
      });

      alert("Signup Successfully");
      await router.push("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <main>
      <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0 bg-gradient-to-t from-zinc-50 via-sky-700 to-indigo-900">
        <div className="max-w-screen-xl bg-white border-gray-300 shadow sm:rounded-lg flex justify-center flex-1">
          <div className="flex-1 bg-blue-900 text-center hidden md:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
              }}
            ></div>
          </div>
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className=" flex flex-col items-center">
              <div className="text-center">
                <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                  Student Sign up
                </h1>
                <p className="text-[12px] text-gray-500 mt-4">
                  Hey enter your details to create your account
                </p>
              </div>
              <form className="w-full flex-1 mt-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="mx-auto max-w-xs flex flex-col gap-4">
                  <input
                    {...register("name", { required: true, maxLength: 50 })}
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 
                    text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Enter your name"
                  />
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
                  <input
                    {...register("phone", { required: true })}
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 
                    text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="tel"
                    placeholder="Enter your phone"
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
                    className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 
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
                    <span className="ml-3">Sign Up</span>
                  </button>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    Already have an account?{" "}
                    <a href="/">
                      <span className="text-blue-900 font-semibold">Sign in</span>
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

export default Register;
