import React from "react";
import {Link} from "react-router-dom";

const TeamPage = () => {
    const teamMembers = [
        {
            id: 1,
            name: "@Marquette Hanson",
            role: "Backend Developer",
            description: "Specializes in Node.js, Express.js, and databases. Responsible for server architecture and API development.",
            github: "https://github.com",
            linkedin: "https://www.linkedin.com/in/marquettehanson/",
            avatar: "https://media.licdn.com/dms/image/v2/D4E03AQFDsyf4en-lag/profile-displayphoto-scale_400_400/B4EZgp1IrZGwAg-/0/1753048453304?e=1760572800&v=beta&t=9yvHjZ4Ok04bBvRAm4xfLOCQSCuOW_Y3ia-ZwEnD36A",
            skills: ["Node.js", "Express.js", "MongoDB", "Postman"]
        },
        {
            id: 2,
            name: "Maede Gholipour",
            role: "Backend Developer",
            description: "Specializes in Node.js, Express.js, and databases. Responsible for server architecture and API development.",
            github: "https://github.com/MaedeGholipourNozari",
            linkedin: "https://linkedin.com",
            avatar: "https://avatars.githubusercontent.com/u/153387174?v=4",
            skills: ["Node.js", "Express.js", "MongoDB", "Postman", "ASP.NET Core", "ASP.NET MVC", "C#", "SQL"]
        },
        {
            id: 3,
            name: "Almira Koshkina",
            role: "Frontend Developer",
            description: "Builds intuitive user interfaces with modern frontend technologies. Focused on UX/UI and performance.",
            github: "https://github.com/AlmiraKoshkina",
            linkedin: "https://www.linkedin.com/in/%D0%B0lmira-%D0%BAoshkina-502822338/",
            avatar: "https://avatars.githubusercontent.com/u/110123483?v=4",
            skills: ["React", "Tailwind CSS", "Figma"]
        },
        {
            id: 4,
            name: "Anna Bazileeva",
            role: "Full Stack Developer",
            description: "Versatile developer with experience in both frontend and backend. Coordinates integration between client and server, testing, and builds responsive design.",
            github: "https://github.com/AnnaViktorovna",
            linkedin: "https://www.linkedin.com/in/anna-bazileeva/",
            avatar: "https://media.licdn.com/dms/image/v2/C4E03AQEelCBYxkkA7w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1591974377687?e=1760572800&v=beta&t=Lzn5H2guUFq960z4Eu8Z9m7v8gKkh6NYyALen_NKhVc",
            skills: ["React", "Node.js", "MongoDB", "Tailwind CSS", "Git", "MySQL"]
        }
    ];

    const repositories = [
        {
            name: "Frontend Repository",
            description: "React application with a modern UI/UX design",
            url: "https://github.com/Code-the-Dream-School/ii-practicum-team-6-front",
            language: "JavaScript",
            stars: 42
        },
        {
            name: "Backend Repository",
            description: "RESTful API with microservices architecture",
            url: "https://github.com/Code-the-Dream-School/jj-practicum-team-5-back",
            language: "Node.js",
            stars: 38
        }
    ];

    return (
        <div className="w-full" style={{
            background: `
      linear-gradient(to bottom,
        rgba(171,212,246,1) 0%,
        rgba(171,212,246,0.9) 60%,
        rgba(171,212,246,0.5) 80%,
        rgba(171,212,246,0) 100%
      )
    `,
        }}>
            <div className="max-w-6xl mx-auto p-4">
                {/* Back Button */}
                <div className="mb-4">
                    <Link
                        to="/"
                        className="px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg"
                        style={{ background: "linear-gradient(to right, #008096, #96007E)" }}
                    >
                        ← Back to Home Page
                    </Link>
                </div>

                {/* Header Card */}
                <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-3 mb-2 backdrop-blur-sm">
                    <div className="text-center border-b border-gray-200 pb-6 mb-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                            Our Team
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Team 5 Practicum 2025{" "}
                            <a
                                href="https://codethedream.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline transition-colors"
                            >
                                Code the Dream School
                            </a>{" "}
                            creating innovative solutions using modern technologies and best development practices.
                        </p>
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600">4</div>
                            <div className="text-sm text-blue-800">Members</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                            <div className="text-2xl font-bold text-green-600">2</div>
                            <div className="text-sm text-green-800">Backend Dev</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                            <div className="text-2xl font-bold text-purple-600">1</div>
                            <div className="text-sm text-purple-800">Frontend Dev</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                            <div className="text-2xl font-bold text-orange-600">1</div>
                            <div className="text-sm text-orange-800">Full Stack</div>
                        </div>
                    </div>
                </div>

                {/* Team Members Grid */}
                <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-3 mb-2 backdrop-blur-sm">
                    <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">Team Members</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="p-3 border border-gray-200 rounded-2xl bg-white bg-opacity-70 hover:bg-opacity-90 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                                <div className="flex items-start gap-4 mb-2">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {member.name}
                                        </h3>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{
                                            backgroundColor: member.role.includes('Backend') ? '#E3F2FD' :
                                                member.role.includes('Frontend') ? '#F3E5F5' : '#E8F5E8',
                                            color: member.role.includes('Backend') ? '#1565C0' :
                                                member.role.includes('Frontend') ? '#7B1FA2' : '#2E7D32'
                                        }}>
                                            {member.role}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                                    {member.description}
                                </p>

                                {/* Skills */}
                                <div className="mb-2">
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex items-center gap-3">
                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        GitHub
                                    </a>
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-3 backdrop-blur-sm">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {repositories.map((repo, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded-2xl bg-white bg-opacity-70 hover:bg-opacity-90 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg" style={{
                                            background: repo.name.includes('Frontend') ?
                                                "linear-gradient(to right, #96007E, #809600)" :
                                                "linear-gradient(to right, #008096, #96007E)"
                                        }}>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{repo.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                                    {repo.language}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    ⭐ {repo.stars}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-2">
                                    {repo.description}
                                </p>

                                <a
                                    href={repo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    style={{
                                        background: repo.name.includes('Frontend') ?
                                            "linear-gradient(to right, #96007E, #809600)" :
                                            "linear-gradient(to right, #008096, #96007E)"
                                    }}
                                >
                                    View Repository
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;
