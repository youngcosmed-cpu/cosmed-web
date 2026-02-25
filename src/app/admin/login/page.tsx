'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { setAccessToken } from '@/lib/api/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true },
      );
      setAccessToken(data.accessToken);
      router.replace('/admin');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 423) {
          setError(err.response?.data?.message || '계정이 잠겼습니다. 잠시 후 다시 시도하세요.');
        } else if (status === 401) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else {
          setError('로그인 중 오류가 발생했습니다.');
        }
      } else {
        setError('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-[#1A1A1A]">
            관리자 로그인
          </h1>
          <p className="mt-2 font-body text-sm text-[#888]">
            Young Cosmed 관리자 대시보드
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 shadow-sm border border-[#E8E8E8]"
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-body">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-body text-sm font-semibold text-[#1A1A1A] mb-1.5"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg border border-[#DDD] font-body text-sm text-[#1A1A1A] placeholder-[#BBB] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              placeholder="admin@cosmed.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block font-body text-sm font-semibold text-[#1A1A1A] mb-1.5"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-lg border border-[#DDD] font-body text-sm text-[#1A1A1A] placeholder-[#BBB] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#1A1A1A] text-white font-body text-sm font-semibold hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          <div className="mt-4 text-center">
            <Link
              href="/admin/reset-password"
              className="font-body text-sm text-[#888] hover:text-[#1A1A1A] transition-colors no-underline"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
