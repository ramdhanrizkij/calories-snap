import React from 'react';

export const BrandLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="38"
    height="34"
    viewBox="0 0 40 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Sparkle rays top-right */}
    <path d="M27.5 4.5L29 1.8" stroke="#5B52E5" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M31.5 7.5L34.5 5.6" stroke="#5B52E5" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M33.2 12.2L36.2 12.2" stroke="#5B52E5" strokeWidth="2.2" strokeLinecap="round" />
    {/* Camera outline body */}
    <path
      d="M7.5 11.5H10.6L12.5 8.5C13.1 7.6 14 7 15.1 7H21.9C23 7 23.9 7.6 24.5 8.5L26.4 11.5H29.5C31.7 11.5 33.5 13.3 33.5 15.5V27.5C33.5 29.7 31.7 31.5 29.5 31.5H7.5C5.3 31.5 3.5 29.7 3.5 27.5V15.5C3.5 13.3 5.3 11.5 7.5 11.5Z"
      stroke="#5B52E5"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Lens circle */}
    <circle cx="18.5" cy="21.2" r="5.3" stroke="#5B52E5" strokeWidth="2.5" />
  </svg>
);

export const HeroBurstRays: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="46"
    height="46"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 18L17 6" stroke="#C7C3FA" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M22 25L35 16" stroke="#C7C3FA" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M25 36L41 39" stroke="#C7C3FA" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

export const CardBurstRays: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="30"
    height="30"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M6 11L9 3" stroke="#ACA6F7" strokeWidth="3" strokeLinecap="round" />
    <path d="M14 16L23 10" stroke="#ACA6F7" strokeWidth="3" strokeLinecap="round" />
    <path d="M16 24L27 25" stroke="#ACA6F7" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const FilledCameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="42"
    height="36"
    viewBox="0 0 44 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.4 3.5C13.9 3.5 12.6 4.3 11.9 5.6L10.3 8.5H7C4.2 8.5 2 10.7 2 13.5V29.5C2 32.3 4.2 34.5 7 34.5H37C39.8 34.5 42 32.3 42 29.5V13.5C42 10.7 39.8 8.5 37 8.5H33.7L32.1 5.6C31.4 4.3 30.1 3.5 28.6 3.5H15.4ZM22 28.2C25.8 28.2 28.9 25.1 28.9 21.3C28.9 17.5 25.8 14.4 22 14.4C18.2 14.4 15.1 17.5 15.1 21.3C15.1 25.1 18.2 28.2 22 28.2Z"
      fill="#5B52E5"
    />
    <circle cx="22" cy="21.3" r="3.6" fill="#5B52E5" />
  </svg>
);
