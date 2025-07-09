'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

type Analyst = {
  name: string;
  email: string;
  phoneNumber: string;
};

type FormData = Analyst & {
  currentPassword: string;
  newPassword: string;
};

export default function Settings() {
  const [user, setUser] = useState<Analyst | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${BACKEND_URL}/api/analysts/me`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data: Analyst = await res.json();
        setUser(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          currentPassword: '',
          newPassword: ''
        });
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}/api/analysts/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setMessage('Profile updated successfully.');
    } else {
      const err = await res.text();
      setMessage(`Failed to update: ${err}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className='text-sm tracking-widest mb-6'>Edit your profile here {user?.name}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-3 bg-[#1e1e1e] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-3 bg-[#1e1e1e] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            className="w-full p-3 bg-[#1e1e1e] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Change Password Section */}
        <div className="pt-6 mt-4 border-t border-gray-700">
          <p className="text-sm text-white/60 mb-3 font-medium">Change Password</p>

          <input
            type="password"
            name="currentPassword"
            className="w-full p-3 mb-3 bg-[#1e1e1e] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Current Password"
            onChange={handleChange}
          />

          <input
            type="password"
            name="newPassword"
            className="w-full p-3 bg-[#1e1e1e] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="New Password"
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-white hover:bg-white/30 text-black tracking-widest font-bold py-3 rounded-full transition duration-200 "
        >
          Save Changes
        </button>

        {/* Message */}
        {message && (
          <p className="text-sm text-green-400 mt-3">{message}</p>
        )}
      </form>
    </div>
  );
}
