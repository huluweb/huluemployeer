import React from 'react';

const CalendarIcon = ({ className = '', ...props }) => {
  return (
    <svg
      version="1.1"
      id="CalendarIcon"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 32 32"
      xmlSpace="preserve"
      className={`fill-current ${className}`}
      {...props}
    >
      <style type="text/css">
        {`
          .pictogram_een { fill: #ffffff; }
          .pictogram_twee { fill: #0b4f84; }
          .pictogram_vijf { fill: #010932; }
          .st0 { fill: #0C6667; }
          .st1 { fill: #E54D2E; }
          .st2 { fill: #F27261; }
          .st3 { fill: none; }
          .st4 { clip-path: url(#SVGID_2_); fill: #F27261; }
          .st5 { clip-path: url(#SVGID_2_); fill: none; }
          .st6 { clip-path: url(#SVGID_6_); fill: #ffffff; }
          .st7 { clip-path: url(#SVGID_8_); fill: #F27261; }
          .st8 { clip-path: url(#SVGID_8_); fill: none; }
          .st9 { clip-path: url(#SVGID_10_); fill: #F27261; }
          .st10 { clip-path: url(#SVGID_10_); fill: none; }
          .st11 { fill: #ffffff; }
        `}
      </style>
      <g>
        <path
          className="pictogram_een"
          d="M32,29c0,1.65-1.35,3-3,3H3c-1.65,0-3-1.35-3-3V3c0-1.65,1.35-3,3-3h26c1.65,0,3,1.35,3,3V29z"
        />
        <path
          className="pictogram_twee"
          d="M3,0C1.35,0,0,1.35,0,3v26c0,1.65,1.35,3,3,3h13V0H3z"
        />
        <path
          className="pictogram_vijf"
          d="M28,7h-3V4h3V7z M19,4H3v3h16V4z M28,11h-3v3h3V11z M19,11H3v3h16V11z M28,18h-3v3h3V18z M19,18H3 v3h16V18z M28,25h-3v3h3V25z M19,25H3v3h16V25z"
        />
      </g>
    </svg>
  );
};

export default CalendarIcon;