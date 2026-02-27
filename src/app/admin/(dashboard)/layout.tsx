'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { useAuth } from '@/lib/auth/useAuth';

const menuItems = [
  { href: '/admin/inquiries', label: '문의 확인', shortLabel: '문의' },
  { href: '/admin/brands', label: '제품 등록/수정', shortLabel: '제품' },
  { href: '/admin/reviews', label: '리뷰 관리', shortLabel: '리뷰' },
  { href: '/admin/invoices', label: '인보이스 생성', shortLabel: '인보이스' },
];

function DashboardHeader() {
  const pathname = usePathname();
  const { admin, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-10 py-[25px] border-b-2 border-border-light">
      <h1 className="font-display text-[27px] font-bold text-admin-dark">
        {menuItems.find((item) => pathname.startsWith(item.href))?.label}
      </h1>
      <div className="flex items-center gap-4">
        {!isLoading && admin && (
          <span className="font-body text-sm text-text-muted">{admin.name}</span>
        )}
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg border border-border-strong font-body text-sm font-semibold text-text-label hover:border-admin-dark hover:text-admin-dark transition-colors cursor-pointer"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-admin">
        <div className="font-body text-sm text-text-muted">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-[224px] bg-admin-dark flex flex-col py-[34px] max-lg:w-[196px] max-md:w-[182px] max-sm:hidden">
        {/* Logo */}
        <div className="font-display text-xl font-bold tracking-[0.05em] text-white px-6 mb-10">
          관리자
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1.5 px-3.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-lg font-body text-[15px] font-semibold transition-all duration-200 no-underline ${
                  isActive
                    ? 'bg-white text-admin-dark'
                    : 'text-admin-nav hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <Link
          href="/"
          className="mx-3.5 my-4 px-4 py-3 rounded-lg border border-white/30 font-body text-[13px] font-semibold text-admin-nav transition-all duration-200 hover:border-white hover:text-white hover:bg-white/10 no-underline text-center"
        >
          ← 사이트로 돌아가기
        </Link>
      </aside>

      {/* Main content */}
      <main className="ml-[224px] flex-1 min-h-screen bg-bg-admin flex flex-col max-lg:ml-[196px] max-md:ml-[182px] max-sm:ml-0">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto max-sm:pb-16">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 flex bg-admin-dark sm:hidden">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 py-3 text-center font-body text-[13px] font-semibold no-underline transition-all duration-200 ${
                isActive
                  ? 'bg-white text-admin-dark'
                  : 'text-admin-nav'
              }`}
            >
              {item.shortLabel}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex-1 py-3 text-center font-body text-[13px] font-semibold no-underline transition-all duration-200 text-admin-nav border-l border-white/20"
        >
          홈
        </Link>
      </nav>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
