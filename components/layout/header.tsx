import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container } from "../util/container";
import { useTheme } from ".";
import { Icon } from "../util/icon";
import { useState } from 'react'; // import useState hook

export const Header = ({ data }) => {
  const router = useRouter();
  const theme = useTheme();

  const headerColor = {
    default:
      "text-black dark:text-white from-gray-50 to-white dark:from-gray-800 dark:to-gray-900",
    primary: {
      blue: "text-white from-blue-300 to-blue-500",
      teal: "text-white from-teal-400 to-teal-500",
      green: "text-white from-green-400 to-green-500",
      red: "text-white from-red-400 to-red-500",
      pink: "text-white from-pink-400 to-pink-500",
      purple: "text-white from-purple-400 to-purple-500",
      orange: "text-white from-orange-400 to-orange-500",
      yellow: "text-white from-yellow-400 to-yellow-500",
    },
  };

  const headerColorCss =
    data.color === "primary"
      ? headerColor.primary[theme.color]
      : headerColor.default;

  const activeItemClasses = {
    blue: "border-b-3 border-blue-200 text-blue-700 dark:text-blue-300 font-medium dark:border-blue-700",
    teal: "border-b-3 border-teal-200 text-teal-700 dark:text-teal-300 font-medium dark:border-teal-700",
    green:
      "border-b-3 border-green-200 text-green-700 dark:text-green-300 font-medium dark:border-green-700",
    red: "border-b-3 border-red-300 text-red-700 dark:text-green-300 font-medium dark:border-red-700",
    pink: "border-b-3 border-pink-200 text-pink-700 dark:text-pink-300 font-medium dark:border-pink-700",
    purple:
      "border-b-3 border-purple-200 text-purple-700 dark:text-purple-300 font-medium dark:border-purple-700",
    orange:
      "border-b-3 border-orange-200 text-orange-700 dark:text-orange-300 font-medium dark:border-orange-700",
    yellow:
      "border-b-3 border-yellow-300 text-yellow-700 dark:text-yellow-300 font-medium dark:border-yellow-600",
  };

  const activeBackgroundClasses = {
    blue: "text-blue-500",
    teal: "text-teal-500",
    green: "text-green-500",
    red: "text-red-500",
    pink: "text-pink-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
    yellow: "text-yellow-500",
  };

  // If we're on an admin path, other links should also link to their admin paths
  const [prefix, setPrefix] = React.useState("");

  const [showMenu, setShowMenu] = useState(false); // add state to toggle menu visibility

  React.useEffect(() => {
    if (window && window.location.pathname.startsWith("/admin")) {
      setPrefix("/admin");
    }
  }, []);

  return (
    <div
      className={`relative bg-gradient-to-b ${headerColorCss}`}
    >
      <Container size="custom" className="py-0 z-10 relative  max-w-8xl">
        <div className="flex items-center justify-between gap-6">
          <h4 className="select-none text-lg font-medium tracking-tight mt-4 transition duration-150 ease-out transform">
            <Link href="/" passHref>
              <a className="flex gap-5 items-center whitespace-nowrap tracking-[.002em]">
                <Icon
                  parentColor={data.color}
                  data={{
                    name: data.icon.name,
                    color: data.icon.color,
                    style: data.icon.style,
                  }}
                />
                <div className="hidden sm:flex md:hidden lg:flex">{data.name}</div>
              </a>
            </Link>
          </h4>
          <div className="relative flex  flex-row md:flex-col items-center gap-6 sm:gap-8 lg:gap-10 tracking-[.002em] -mx-4">
            <button 
              className="block md:hidden absolute -mx-16 text-gray-800 focus:outline-none focus:ring"
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Render the original menu only on large screens */}
            <ul className="hidden md:flex items-end gap-6 md:gap-4 lg:gap-10 tracking-[.002em] -mx-4">
              {data.nav &&
                data.nav.map((item, i) => {
                  const activeItem =
                    item.href === ""
                      ? router.asPath === "/"
                      : router.asPath.includes(item.href);
                  return (
                    <li
                      key={`${item.label}-${i}`}
                      className={`${
                        activeItem ? activeItemClasses[theme.color] : ""
                      }`}
                    >
                      <Link href={`${prefix}/${item.href}`} passHref>
                        <a 
                          className={`relative select-none  text-base inline-block tracking-wide transition duration-150 ease-out hover:opacity-100 pt-10 pb-6 px-2 ${
                            activeItem ? `` : `opacity-70`
                          }`}
                        >
                          {item.label}
                        </a>
                      </Link>
                    </li>
                  );
                })}
            </ul>
            {/* Render the burger menu only on small screens */}
            {showMenu ? (
              <ul className="block md:hidden absolute top-full right-0 mt-11 p-2 pl-8 pr-12 bg-white border-2 border-gray-100 rounded-sm shadow-xl">
                {data.nav &&
                  data.nav.map((item, i) => {
                    const activeItem =
                      item.href === ""
                        ? router.asPath === "/"
                        : router.asPath.includes(item.href);
                    return (
                      <li
                        key={`${item.label}-${i}`}
                        className={`${
                          activeItem ? activeItemClasses[theme.color] : ""
                        }`}
                      >
                        <Link href={`${prefix}/${item.href}`} passHref>
                          <a 
                            className={`relative select-none  text-base block text-gray-900 text-l tracking-wide transition duration-150 ease-out hover:opacity-100 py-2`}
                          >
                            {item.label}
                          </a>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            ) : null}
          </div>
        </div>
        <div
          className={`absolute h-1 bg-gradient-to-r from-transparent ${
            data.color === "primary" ? `via-white` : `via-black dark:via-white`
          } to-transparent bottom-0 left-4 right-4 -z-1 opacity-5`}
        />
      </Container>
    </div>
  );
};
