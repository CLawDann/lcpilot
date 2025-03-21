'use client';

import Link from 'next/link';
import MemoryIcon from '@mui/icons-material/Memory';
import { Button, buttonVariants } from './Button';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Suspense } from 'react';
import OpenProfile from './profile/OpenProfile';
import Profile from './profile/Modal';

type Props = {};

const Navbar = (props: Props) => {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 w-full bg-white/10 backdrop-blur-md">
      <div className="mx-auto flex w-full items-center justify-between p-2 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <MemoryIcon className="h-6 w-6 text-purple-400" />
            <span className="sr-only">LCPilot</span>
          </Link>
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/source">Source</Link>
            </li>
          </ul>
        </div>
        <div className="relative flex items-center">
          {session ? (
            <Suspense fallback={<OpenProfile session={session} />}>
              <Profile session={session} />
            </Suspense>
          ) : (
            <Button
              onClick={() => signIn('github')}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
