import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M12.5 4.5a8 8 0 100 16 8 8 0 000-16zM11 6.375a.75.75 0 011.5 0V11h4.625a.75.75 0 010 1.5H12.5v4.625a.75.75 0 01-1.5 0V12.5H6.375a.75.75 0 010-1.5H11V6.375z"
      clipRule="evenodd"
    />
    <path d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" />
  </svg>
);
