import React from "react";

const Logo = ({
  className = "h-12 w-auto",
  textClassName = "text-xl font-bold",
}) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <img
        src="/logo.png"
        alt="Samarth Classes Logo"
        className={`${className} object-contain`}
      />
      <span className={`${textClassName} text-blue-700 tracking-tight`}>
        Samarth
      </span>
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
        alt="Samarth Classes Logo"
        className={`${className} object-contain brightness-0 invert`}
      />
      <span className={textClassName}>Samarth</span>
    </div>
  );
};

export default Logo;
