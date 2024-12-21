"use client";
import { motion } from "framer-motion";
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
    <div className="flex gap-2 overflow-x-auto">
      {months.map((month) => (
        <motion.button
          key={month}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`whitespace-nowrap rounded-full px-3 py-1 text-sm ${
            selectedMonth === month
              ? "bg-primary font-bold"
              : "hover:bg-secondary-foreground hover:text-primary-foreground"
          }`}
          onClick={() => setSelectedMonth(month)}
        >
          {month === "total" ? "2024" : month}
        </motion.button>
      ))}
    </div>
  );
};
