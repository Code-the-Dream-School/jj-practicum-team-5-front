import { useState } from "react";
import {useNavigate} from "react-router-dom";

export default function ProjectsSliderPage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const navigate = useNavigate();

    const projects = [
        {
            id: 1,
            title: "Wedding Celebration",
            description: "Elegant wedding ceremony with 150 guests in a beautiful garden venue",
            image: "/images/wedding.jpeg",
            date: "09/15/2025",
            status: "Completed",
        },
        {
            id: 2,
            title: "Gender reveal",
            description: "Gender reveal with family and close friends",
            image: "/images/gender.jpeg",
            date: "09/09/2025",
            status: "In Progress",
        },
        {
            id: 3,
            title: "Birthday Party",
            description: "Fun birthday celebration with themed decorations and entertainment",
            image: "/images/bd.jpeg",
            date: "11/10/2025",
            status: "Not started",
        },
        {
            id: 4,
            title: "Cruise",
            description: "Caribbean cruise 1 week",
            image: "/images/cruise.jpeg",
            date: "05/05/2026",
            status: "In Progress",
        },
        {
            id: 5,
            title: "Trip",
            description: "Trip to LV",
            image: "/images/trip.jpeg",
            date: "08/01/2025",
            status: "Overdue",
        },
        {
            id: 6,
            title: "Baby Shower",
            description: "Mary's baby shower organized by Olia",
            image: "/images/shower.jpeg",
            date: "10/10/2025",
            status: "In Progress",
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Not started':
                return 'bg-purple-100 text-purple-800';
            case 'Overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(projects.length / 3));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + Math.ceil(projects.length / 3)) % Math.ceil(projects.length / 3));
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const visibleProjects = projects.slice(currentSlide * 3, currentSlide * 3 + 3);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Event Projects
                    </h1>
                </div>


                <div className="relative px-16">
                    <div className="overflow-hidden rounded-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visibleProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl flex flex-col h-full"
                                >
                                    <div className="w-full h-48 rounded-xl mb-4 overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div
                                            className="w-full h-48 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl flex items-center justify-center text-gray-500 text-sm"
                                            style={{display: 'none'}}
                                        >
                                            Image not available
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {project.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                                        {project.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Date:</span>
                                            <span className="font-medium text-gray-700">{project.date}</span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button type="button"
                                                onClick={() => navigate(`/project/${project.id}`)} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105">
                                            View Details
                                        </button>
                                        <button onClick={() => navigate(`/project/${project.id}`)} className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium text-sm hover:border-gray-400 hover:text-gray-700 transition-all duration-300">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-400"
                        disabled={projects.length <= 3}
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-400"
                        disabled={projects.length <= 3}
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>


                {Math.ceil(projects.length / 3) > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({ length: Math.ceil(projects.length / 3) }).map((_, index) => (
                            <button
                             key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    currentSlide === index
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                )}


                <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {projects.length}
                        </div>
                        <div className="text-gray-600 text-sm">Total Projects</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {projects.filter(p => p.status === 'Completed').length}
                        </div>
                        <div className="text-gray-600 text-sm">Completed</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {projects.filter(p => p.status === 'In Progress').length}
                        </div>
                        <div className="text-gray-600 text-sm">In Progress</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {projects.filter(p => p.status === 'Overdue').length}
                        </div>
                        <div className="text-gray-600 text-sm">Overdue</div>
                    </div>
                </div>
            </div>
        </div>
    );
}