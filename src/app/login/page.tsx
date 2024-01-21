'use client';
import Header from '@/components/header/header';
import React, { useState } from 'react';
import axios from 'axios';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

export default function Login(): React.JSX.Element {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  async function onLogin(): Promise<void> {
    try {
      const loginResponse = await axios({
        url: '/api/auth/login',
        method: 'POST',
        data: { email, password },
      });

      console.log(loginResponse);

      // const token: string = loginResponse.data.token;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="flex flex-col justify-center items-center">
      <Header />

      <div className="flex flex-col justify-center items-center my-5 w-full">
        <h1 className="text-xl p-3">Login</h1>
        <form className="flex flex-col p-3 sm:w-1/4">
          <input
            type="email"
            id="email"
            placeholder="email"
            className="p-2 my-2 rounded-md text-black"
            onChange={e => setEmail(e.target.value)}
          />
          <div className="w-full relative">
            <input
              type={viewPassword ? 'text' : 'password'}
              id="password"
              placeholder="password"
              className="p-2 my-2 rounded-md text-black w-full"
              onChange={e => setPassword(e.target.value)}
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
            type="button"
            onClick={onLogin}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
