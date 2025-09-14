import React from "react";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
    const teamMembers = [
        { name: "Almira", url: "https://www.linkedin.com/in/daria-pavlyuk/" },
        { name: "Anna", url: "https://www.linkedin.com/in/anna-bazileeva/" },
        { name: "Maede", url: "https://www.linkedin.com/in/sheper96/" },
        { name: "Marquette", url: "https://www.linkedin.com/in/marquettehanson/" },

    ];

    return (
        <footer className="bg-gray-100 text-center p-4
                   relative md:fixed md:bottom-0 md:w-full">
            {/* Ссылка на команду */}
            <div className="mb-3 text-gray-700 text-xl font-medium">
                <a
                    href="https://www.linkedin.com/company/team5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center justify-center gap-2"
                >
                    <FaLinkedin className="w-5 h-5 text-blue-600" />
                    Team 5, 2025
                </a>
            </div>

            {/* Ссылки на участников */}
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