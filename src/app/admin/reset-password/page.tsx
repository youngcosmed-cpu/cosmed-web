'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function RequestForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/auth/password-reset/request`, { email });
      setMessage('비밀번호 재설정 링크가 이메일로 발송되었습니다.');
    } catch {
      setError('요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-8 shadow-sm border border-[#E8E8E8]"
    >
      <p className="mb-4 font-body text-sm text-[#666]">
        가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
      </p>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-body">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-body">
          {error}
        </div>
      )}

      <div className="mb-6">
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-lg bg-[#1A1A1A] text-white font-body text-sm font-semibold hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '발송 중...' : '재설정 링크 보내기'}
      </button>
    </form>
  );
}

function ConfirmForm({ token }: { token: string }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPassword)) {
      setError('비밀번호는 8자 이상, 영문자와 숫자를 각각 1개 이상 포함해야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/auth/password-reset/confirm`, {
        token,
        newPassword,
      });
      setMessage('비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('유효하지 않거나 만료된 링크입니다. 다시 요청하세요.');
      } else {
        setError('비밀번호 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-8 shadow-sm border border-[#E8E8E8]"
    >
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-body">
          {message}
          <div className="mt-2">
            <Link
              href="/admin/login"
              className="text-green-800 font-semibold underline"
            >
              로그인하기
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-body">
          {error}
        </div>
      )}

      {!message && (
        <>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block font-body text-sm font-semibold text-[#1A1A1A] mb-1.5"
            >
              새 비밀번호
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-lg border border-[#DDD] font-body text-sm text-[#1A1A1A] placeholder-[#BBB] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              placeholder="8자 이상, 영문자 + 숫자 포함"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block font-body text-sm font-semibold text-[#1A1A1A] mb-1.5"
            >
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-lg border border-[#DDD] font-body text-sm text-[#1A1A1A] placeholder-[#BBB] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#1A1A1A] text-white font-body text-sm font-semibold hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-[#1A1A1A]">
            비밀번호 재설정
          </h1>
        </div>

        {token ? <ConfirmForm token={token} /> : <RequestForm />}

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="font-body text-sm text-[#888] hover:text-[#1A1A1A] transition-colors no-underline"
          >
            ← 로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
