"use client";
import {motion} from "framer-motion";
import { useState } from "react";
export const MonthSelector = () => {
  const [selectedMonth, setSelectedMonth] = useState("total");
  const months = [
    "total",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto">
      {months.map((month) => (
        <motion.button
          key={month}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`whitespace-nowrap rounded-full px-3 py-1 text-sm ${
            selectedMonth === month
              ? "bg-green-400 font-bold text-black"
              : "text-white hover:bg-[#383838]"
          }`}
          onClick={() => setSelectedMonth(month)}
        >
          {month === "total" ? "2024" : month}
        </motion.button>
      ))}
    </div>
  );
};
