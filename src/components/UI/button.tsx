import React from 'react';

export default function WhiteButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`p-3 my-3 border-2 border-[var(--foreground)] rounded-md hover:bg-[var(--foreground)] hover:text-[var(--background-start)] ${props.className}`}
    />
  );
}
