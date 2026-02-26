'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import axios from 'axios';
import { API_URL, setAccessToken } from '@/lib/api/client';
import { Header } from '@/components/layout/Header';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
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
      const safeReturnUrl = returnUrl?.startsWith('/admin') ? returnUrl : '/admin';
      router.replace(safeReturnUrl);
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
    <div className="min-h-screen flex flex-col bg-bg-admin">
      <Header minimal />
      <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-admin-dark">
            관리자 로그인
          </h1>
          <p className="mt-2 font-body text-sm text-text-muted">
            Young Cosmed 관리자 대시보드
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 shadow-sm border border-border-light"
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-body">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-body text-sm font-semibold text-admin-dark mb-1.5"
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
              className="w-full px-4 py-3 rounded-lg border border-border-strong font-body text-sm text-admin-dark placeholder-text-disabled focus:outline-none focus:border-admin-dark transition-colors"
              placeholder="admin@cosmed.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block font-body text-sm font-semibold text-admin-dark mb-1.5"
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
              className="w-full px-4 py-3 rounded-lg border border-border-strong font-body text-sm text-admin-dark placeholder-text-disabled focus:outline-none focus:border-admin-dark transition-colors"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-admin-dark text-white font-body text-sm font-semibold hover:bg-admin-dark-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          <div className="mt-4 text-center">
            <Link
              href="/admin/reset-password"
              className="font-body text-sm text-text-muted hover:text-admin-dark transition-colors no-underline"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
