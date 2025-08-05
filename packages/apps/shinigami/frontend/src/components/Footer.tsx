export default function Footer() {
  return (
    <div className="relative">
      {/* More wavy top edge */}
      <div className="absolute top-0 left-0 w-full -translate-y-full">
        <svg
          className="w-full h-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#223D3C"
            d="M0,160 C360,0 1080,320 1440,160 L1440,320 L0,320 Z"
          />
        </svg>
      </div>

      {/* Footer */}
      <footer className="bg-[#223D3C] text-white p-4 h-32 relative z-10">
        <div className="flex items-center justify-center h-full">
          <p>© 2025 Yayasan Sejarah Timbanganten</p>
        </div>
      </footer>
    </div>
  );
}
