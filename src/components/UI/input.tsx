import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import * as Icons from 'react-icons/io';
import { IconType } from 'react-icons/lib';

interface InputProps {
  type: 'email' | 'password' | 'text';
  placeholder?: string;
  className?: string;
  binding?: UseFormRegisterReturn<string>;
  errorMessage?: string;
  invalid?: boolean;
  icon?: React.JSX.Element;
}

export default function CustomInput(props: InputProps): React.JSX.Element {
  return (
    <>
      <div className="relative">
        <span className="absolute text-black left-0 top-1/3 block mx-2">{props.icon}</span>
        <input
          type={props.type}
          placeholder={props.placeholder}
          className={`p-2 px-7 my-2 rounded-md text-black w-full ${props.className}`}
          {...props.binding}
        />
      </div>
      {props.invalid && <span className="text-red-500 text-xs">{props.errorMessage}</span>}
    </>
  );
}
