'use client';
import Header from '@/components/header/header';
import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { IoMdEye, IoMdEyeOff, IoMdMail, IoMdLock, IoIosMail } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/feedback/loader';
import { useForm, SubmitHandler } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import Input from '@/components/UI/input';

type LoginForm = {
  email: string;
  password: string;
};
const loginFormSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('Please enter a valid email address')
    .required(),
  password: Joi.string().required(),
});

export default function Login(): React.JSX.Element {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: joiResolver(loginFormSchema),
    mode: 'onChange',
    delayError: 1000,
  });

  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLogin: SubmitHandler<LoginForm> = async (loginForm: LoginForm) => {
    try {
      setIsLoading(true);
      const token = (
        await axios<{ token: string }>({
          url: '/api/auth/login',
          method: 'POST',
          data: { email: loginForm.email, password: loginForm.password },
        })
      ).data.token;

      localStorage.setItem('token', token);
      router.push('/home');
    } catch (error) {
      return console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center">
      <Header />
      <Loader showLoading={isLoading} />

      <div className="flex flex-col justify-center items-center my-5 w-full">
        <h1 className="text-xl p-3">Login</h1>
        <form className="flex flex-col p-3 sm:w-1/4" onSubmit={handleSubmit(onLogin)}>
          <Input
            type="email"
            placeholder="Email"
            binding={register('email')}
            invalid={errors.email ? true : false}
            errorMessage={errors.email?.message}
            icon={<IoMdMail />}
          />
          <div className="w-full relative">
            <Input
              type={viewPassword ? 'text' : 'password'}
              placeholder="Password"
              binding={register('password')}
              invalid={errors.password ? true : false}
              errorMessage={errors.password?.message}
              icon={<IoMdLock />}
            />
            <button
              className="absolute top-0 right-0 bottom-0 p-2 text-black"
              type="button"
              onClick={() => setViewPassword(!viewPassword)}
            >
              {viewPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
          </div>
          <button
            className="border-2 my-3 rounded-md p-1 hover:bg-white hover:text-black ease-in-out duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
