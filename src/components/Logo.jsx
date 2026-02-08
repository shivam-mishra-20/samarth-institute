import React from "react";

const Logo = ({
  className = "h-12 w-auto",
  textClassName = "text-xl font-semibold",
}) => {
  return (
    <div className="flex items-center gap-4 py-2">
      <img
        src="/logo_2.jpg"
        alt="Samarth Classes"
        className={`${className} p-1`}
      />
      <div className={textClassName}></div>
    </div>
  );
};

export const LogoWhite = ({
  className = "h-12 w-auto",
  textClassName = "text-xl font-bold text-white",
}) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <img
        src="/logo.png"
        alt="Samarth Classes"
        className={`${className} p-1 brightness-0 invert`} // Making it white for dark backgrounds
      />
      <span className={textClassName}>Samarth Institute</span>
    </div>
  );
};

export default Logo;
