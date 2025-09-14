import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
    const teamMembers = [
        { name: "Almira", url: "https://www.linkedin.com" },
        { name: "Anna", url: "https://www.linkedin.com/in/anna-bazileeva/" },
        { name: "Maede", url: "https://www.linkedin.com" },
        { name: "Marquette", url: "https://www.linkedin.com/in/marquettehanson/" },

    ];

    return (
        <footer className="bg-gray-100 text-center py-3 ">

            <div className="mb-3 mt-2 text-[#5A004C] text-xl font-medium">
                <Link
                    to="/team"
                    className="hover:underline flex items-center justify-center gap-2"
                >
                    Team 5, 2025
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                {teamMembers.map((member) => (
                    <a
                        key={member.name}
                        href={member.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center group"
                    >
                        <FaLinkedin className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        <span className="mt-2 text-sm text-gray-600 group-hover:text-black">
          {member.name}
        </span>
                    </a>
                ))}
            </div>
        </footer>
    )}