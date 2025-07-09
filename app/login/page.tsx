"use client";
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Login() {
  const refs = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', email); // Spring Security expects 'username' for the email
      formData.append('password', password); // Spring Security expects 'password' for the password

      const res = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          // 2. Set the correct Content-Type header
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        credentials: 'include',
        redirect: 'manual' 
      });

      // 4. Handle the response based on the status code
      if (res.status === 302) {
          // A 302 status means a redirect occurred.
          const redirectUrl = res.headers.get('Location');
          if (redirectUrl) {
              if (redirectUrl.includes('/login?error')) {
                  setMessage('Login failed: Invalid credentials.');
                  console.error('Redirected to:', redirectUrl);
              } else if (redirectUrl.includes('/')) {
                  // This is the default redirect for a successful login.
                  setMessage('Login successful! Redirecting...');
                  router.push('/dashboard');
              } else {
                  setMessage('Login process completed with an unexpected redirect.');
                  console.error('Redirected to:', redirectUrl);
              }
          } else {
              setMessage('Login failed: Redirect location header missing.');
          }
      } else if (res.ok) { // This block will run if the server returns a 2xx status without a redirect.
          setMessage(`Login successful! Redirecting to dashboard...`);
          setEmail('');
          setPassword('');
          router.push('/dashboard');
      } else { // This handles other non-2xx status codes (e.g., 401, 403, 404).
          const text = await res.text();
          setMessage(`Login failed: ${text}`);
          console.error('Backend response text:', text);
      }
    } catch (error) {
      setMessage('Login failed: ' + error.message || 'An unexpected error occurred');
      console.error('Login error:', error);
    }
  };

  return (
    <div
      ref={refs}
      id="contact"
      className="h-full max-w-[1366px] gap-12 mx-auto px-12 flex items-center justify-center relative"
    >
      <div className="absolute top-0 left-0">
        <div className="flex flex-row gap-2 p-5 items-center">
          <Image src="/logo.svg" alt="logo" width={500} height={500} className="h-15 w-15" priority/>
          <span className="text-xl font-bold tracking-widest">FinOps</span>
        </div>
      </div>

      <div className="flex flex-row gap-20 items-center justify-between pt-32">
        <div className="text-container text-white flex flex-col gap-10 pb-5">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: 'circOut', duration: 1 }}
            className="text-4xl font-bold leading-tight uppercase tracking-widest font-mono"
          >
            Intelligent <span className='bg-clip-text bg-gradient-to-r from-[#39ff14] to-white/5 text-transparent'>Defense</span> for <span className='bg-clip-text bg-gradient-to-r to-[#39ff14] from-white/5 text-transparent'>Financial</span> Ecosystems
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: 'circOut', duration: 1.5, delay: 1 }}
            className="font-bold text-md tracking-widest uppercase"
          >
            Real-time fraud detection and advanced transaction monitoring, securing your assets with unparalleled precision.
          </motion.h1>
        </div>
        {message && (
          <motion.div
            className="text-red-500 text-lg font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.div>
        )}
        <div className="form-container text-white flex flex-col gap-5 relative">
          <motion.form
            className="flex flex-col gap-5 pt-5 w-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            onSubmit={handleSubmit}
          >
            <input
              className="p-5 pr-5 bg-transparent border-b-2 border-b-white rounded-md"
              type="email"
              required
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="p-5 bg-transparent border-b-2 border-b-white rounded-md"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="p-5 bg-white hover:bg-white/40 rounded-full cursor-pointer">
              <h1 className="text-black tracking-widest uppercase text-md font-bold">Login</h1>
            </button>
            <Link href="/">
            <h3 className='text-sm text-blue-500 tracking-widest'>New here?</h3>
            </Link>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
