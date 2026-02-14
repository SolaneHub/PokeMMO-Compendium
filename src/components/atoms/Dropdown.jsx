import { useEffect, useRef, useState } from "react";
const Dropdown = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  className = "",
  contentClassName = "",
  align = "left", // 'left' | 'right' | 'center'
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);
  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {" "}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {" "}
        {trigger}{" "}
      </div>{" "}
      {isOpen && (
        <div
          className={`absolute top-full z-50 mt-2 animate-[fade-in_0.1s_ease-out] ${alignmentClasses[align]} ${contentClassName}`}
        >
          {" "}
          {children}{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default Dropdown;
