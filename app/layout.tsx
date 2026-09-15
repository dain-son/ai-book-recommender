import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const sans = Noto_Sans_KR({
  variable: '--font-sans-kr',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const serif = Noto_Serif_KR({
  variable: '--font-serif-kr',
  subsets: ['latin'],
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: '책갈피 — 오늘 읽을 책 찾기',
  description: '분야를 고르고 취향 몇 가지만 답하면, 지금 읽기 좋은 책 4권을 골라 드립니다.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-line">
          <div className="mx-auto flex w-full max-w-3xl items-baseline justify-between gap-4 px-5 py-4">
            <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
              책갈피
            </Link>
            <nav className="flex items-baseline gap-4 text-sm">
              <Link
                href="/my"
                className="text-muted transition hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                내 기록
              </Link>
              <Link
                href="/books"
                className="text-muted transition hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                모아보기
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto w-full max-w-3xl px-5 py-6 text-xs text-muted">
            AI가 웹 검색 결과를 참고해 추천합니다. 출간 정보는 서점에서 한 번 더 확인해 주세요.
          </div>
        </footer>
      </body>
    </html>
  );
}
