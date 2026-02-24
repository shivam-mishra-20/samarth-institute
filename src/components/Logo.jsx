import React from "react";

const Logo = ({
  className = "h-16 w-auto",
 
}) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <img
        src="/logo_2.jpg"
        alt="Samarth Classes Logo"
        className={`${className} object-contain`}
      />
    
    </div>
  );
};

export const LogoWhite = ({
  className = "h-16 w-auto",
  textClassName = "text-xl font-bold text-white",
}) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <img
        src="/logo.png"
        alt="Samarth Classes Logo"
        className={`${className} object-contain`}
      />
      <span className={textClassName}>Samarth Institute</span>
    </div>
  );
};

export default Logo;
