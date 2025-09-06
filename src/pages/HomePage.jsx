import React from 'react';
import { Link } from 'react-router-dom';


export default function HomePage() {
    return (
        <div className="h-screen bg-blue-200" >
            <section className="relative overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Manage Projects
                            <span className="block text-blue-700">Efficiently</span>
                        </h1>
                        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Modern project management system that helps your team achieve goals faster and more organized
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-xl border border-yellow-600 hover:from-yellow-500 hover:to-yellow-600 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                Registration Required
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-6 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Comprehensive project management solution with intuitive interface
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-md border border-gray-200">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">

                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Task Management
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Create, assign and track tasks with a convenient interface and automated notifications
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-md border border-gray-200">
                            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">

                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Team Collaboration
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Unite teams, share files and communicate in real-time to achieve common goals
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-md border border-gray-200">
                            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Project Planning
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Plan timelines, set deadlines and track progress with interactive charts and diagrams
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Why Choose Our System?
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Easy to Use", text: "Intuitive interface that requires no lengthy training" },
                                    { title: "Flexible Configuration", text: "Adapt the system to your business needs" },
                                    { title: "Real-time Analytics", text: "Get up-to-date data on project progress" },
                                    { title: "Data Security", text: "Reliable protection and backup of your data" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                            <p className="text-gray-600">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:pl-8">
                            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                                    <p className="text-gray-600 mb-6">increase in team efficiency</p>

                                    <div className="text-4xl font-bold text-green-600 mb-2">50%</div>
                                    <p className="text-gray-600">reduction in project delays</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 bg-blue-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-xl border border-yellow-600 hover:from-yellow-500 hover:to-yellow-600 hover:text-white transition-all duration-200"
                        >
                            Registration Required
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
