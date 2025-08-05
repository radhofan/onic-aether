"use client";

import Image from "next/image";
import { UserCircle, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useAuthStore } from '@/stores/useAuthStore';

export default function Header({ hideBanner = false }: { hideBanner?: boolean }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const name = useAuthStore((state) => state.name);
  const role = useAuthStore((state) => state.role);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-white relative">
        <Link href="/admin">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 relative">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <h1 className="text-xl font-bold cursor-pointer">Timbanganten</h1>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 ml-auto mr-8" ref={wrapperRef}>
          <Link href="/admin">
            <h1 className="text-lg font-medium cursor-pointer hover:text-green-600">Home</h1>
          </Link>
          <Link href="/admin/layanan">
            <h1 className="text-lg font-medium cursor-pointer hover:text-green-600">Pelayanan</h1>
          </Link>

          <div className="flex flex-col items-end text-right">
            <span className="text-base font-semibold">{name || "Guest"}</span>
            <span className="text-sm text-gray-600">
              {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Guest"}
            </span>
          </div>

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="hover:text-green-600 focus:outline-none"
          >
            <UserCircle className="w-8 h-8" />
          </button>

          {showDropdown && (
            <div className="absolute top-16 right-8 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <ul className="py-2">
                <li
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowDropdown(false);
                    router.push('/admin/login/pengawas');
                  }}
                >
                  Pengawas
                </li>
                <li
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowDropdown(false);
                    router.push('/admin/login/admin');
                  }}
                >
                  Admin
                </li>
                <li
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowDropdown(false);
                    router.push('/admin/login/approver');
                  }}
                >
                  Approver
                </li>
              </ul>
            </div>
          )}
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t z-50">
            <div className="flex flex-col items-start p-4 space-y-4">
              <Link href="/admin" className="w-full">
                <span className="block w-full text-left text-lg font-medium hover:text-green-600">Home</span>
              </Link>
              <Link href="/admin/layanan" className="w-full">
                <span className="block w-full text-left text-lg font-medium hover:text-green-600">Pelayanan</span>
              </Link>
              <div className="text-left">
                <span className="text-base font-semibold">{name || "Guest"}</span><br />
                <span className="text-sm text-gray-600">
                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Guest"}
                </span>
              </div>
              <div className="w-full border-t pt-2">
                <button
                  onClick={() => router.push('/admin/login/pengawas')}
                  className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Pengawas
                </button>
                <button
                  onClick={() => router.push('/admin/login/admin')}
                  className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Admin
                </button>
                <button
                  onClick={() => router.push('/admin/login/approver')}
                  className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Approver
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {!hideBanner && (
        <div
          className="w-full relative mb-12 overflow-hidden"
          style={{
            height: "800px",
            clipPath: "polygon(0 0, 100% 0, 100% 92%, 90% 94%, 80% 92%, 70% 95%, 60% 92%, 50% 95%, 40% 92%, 30% 95%, 20% 92%, 10% 94%, 0 92%)",
            WebkitClipPath: "polygon(0 0, 100% 0, 100% 92%, 90% 94%, 80% 92%, 70% 95%, 60% 92%, 50% 95%, 40% 92%, 30% 95%, 20% 92%, 10% 94%, 0 92%)",
          }}
        >
          <Image
            src="/images/makam-1.png"
            alt="Banner image"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60 pointer-events-none"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Sistem Layanan Pemakaman Timbanganten</h1>
            <div className="text-lg md:text-xl max-w-2xl">
              Your supporting text or description goes here. You can customize this content.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
