import { Kaisei_Decol } from 'next/font/google';
import React from 'react';
import { GiJesterHat } from 'react-icons/gi';

const hedvig_letters_serif = Kaisei_Decol({ weight: ['400'], subsets: ['latin'] });

export default function Header(): React.JSX.Element {
  return (
    <header className="w-full">
      <div className="border-b-2 flex items-center ">
        <span className="ps-2 py-4 ms-7 me-3">
          <GiJesterHat className={`text-3xl`} />
        </span>
        <h1
          className={`text-3xl p-2 py-4 ${hedvig_letters_serif.className}`}
          style={{ letterSpacing: '8px' }}
        >
          Jezzter
        </h1>
      </div>
    </header>
  );
}
