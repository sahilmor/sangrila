'use client';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`p-2 fixed top-0 left-0 right-0 z-50 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm text-black"
          : isHomePage
            ? "bg-transparent text-white"
            : "bg-transparent text-black"
      }`}
    >
      <div className="max-w-[90%]  mx-auto flex items-center md:justify-between justify-center">
        <Link href="/" className="flex items-center gap-2">
        <div className="relative w-16 h-auto">
            <Image
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDPAnCbkbi91J10pmaIaoQeBvw87cfEJ34-A&s'
              alt="Sangrila 2k25"
              className="object-contain rounded-full"
              width={80}
              height={80}
              priority
            />
            </div>
          <span className="text-xl font-bold">
            Sangrila 2k25
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
