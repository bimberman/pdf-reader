import React from "react";
const DragHandleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    viewBox="0 0 24 28"
    fill="none"
    {...props}
  >
    {/* Up arrow - larger and higher */}
    <path d="M12 1l-5 5h10l-5-5z" fill="currentColor" />
    {/* Three solid lines, spaced further apart */}
    <rect x="4" y="10" width="16" height="1" rx="0.5" fill="currentColor" />
    <rect x="4" y="13" width="16" height="1" rx="0.5" fill="currentColor" />
    <rect x="4" y="16" width="16" height="1" rx="0.5" fill="currentColor" />
    {/* Down arrow - larger and lower */}
    <path d="M12 27l5-5H7l5 5z" fill="currentColor" />
  </svg>
);
export default DragHandleIcon;
