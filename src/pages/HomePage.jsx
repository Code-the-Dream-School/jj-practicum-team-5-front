import React from "react";
import { Link } from "react-router-dom";

export default function HomePage({ fadeStart = 10 }) {
  return (
      <div className="h-screen overflow-y-auto flex flex-col">
        {/* Hero */}
        <section className="relative">
          <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
              linear-gradient(to bottom,
                rgba(171,212,246,1) 0%,
                rgba(171,212,246,0.9) 60%,
                rgba(171,212,246,0.5) 80%,
                rgba(171,212,246,0) 100%
              )
            `,
              }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6 z-10">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                Manage Projects
                <span className="block mt-1 text-[#007A8E]">Efficiently</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-700 mb-4 max-w-2xl mx-auto leading-relaxed">
                Modern project management system that helps your team achieve
                goals faster and more organized
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    to="/login"
                    className="px-6 py-2 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-sm sm:text-base"
                    style={{
                      background: "linear-gradient(to right, #008096, #96007E)",
                    }}
                >
                  Login
                </Link>
                <Link
                    to="/signup"
                    className="px-6 py-2 text-white font-semibold rounded-xl shadow-md hover:shadow-lg text-sm sm:text-base"
                    style={{
                      background: "linear-gradient(to right, #96007E, #809600)",
                    }}
                >
                  Registration Required
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features + Why Choose Us */}
        <section className="relative">
          <div className="absolute inset-0 pointer-events-none">
            <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                linear-gradient(to top,
                  rgba(255,255,255,0) ${fadeStart}%,
                  rgba(255,255,255,1) 100%
                ),
                url('/images/mycelium.webp')
              `,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
            />
          </div>

          <div className="relative z-10">
            {/* Features */}
            <div className="py-4 sm:py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Everything You Need to Succeed
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                    Comprehensive project management solution with intuitive
                    interface
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { icon: "📋", bg: "#004C5A", title: "Task Management", text: "Create, assign and track tasks" },
                    { icon: "👥", bg: "#4C5A00", title: "Team Collaboration", text: "Unite teams and share files" },
                    { icon: "📊", bg: "#5A004C", title: "Project Planning", text: "Plan timelines and monitor progress" },
                  ].map((f, i) => (
                      <div
                          key={i}
                          className="text-center p-6 rounded-xl bg-white bg-opacity-90 hover:bg-gray-50 shadow-md transition"
                      >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                            style={{ backgroundColor: f.bg }}
                        >
                          <span className="text-white text-2xl">{f.icon}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                        <p className="text-sm text-gray-600">{f.text}</p>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-4 sm:py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    Why Choose Our System?
                  </h2>
                  <div className="space-y-4">
                    {[
                      { icon: "✨", title: "Easy to Use", text: "No lengthy training required" },
                      { icon: "⚙️", title: "Flexible Configuration", text: "Adapt the system to your needs" },
                      { icon: "📈", title: "Real-time Analytics", text: "Up-to-date project progress" },
                      { icon: "🔒", title: "Data Security", text: "Reliable protection and backup" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start space-x-3 p-3 bg-white bg-opacity-80 rounded-lg shadow-sm">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{item.text}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white bg-opacity-90 border border-gray-200 rounded-xl shadow-lg p-6 mt-6 lg:mt-0">
                  <div className="text-center space-y-6">
                    <div>
                      <div className="text-3xl sm:text-4xl font-bold text-[#B40098]">95%</div>
                      <p className="text-gray-600 text-sm">increase in efficiency</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="text-3xl sm:text-4xl font-bold text-[#B40098]">50%</div>
                      <p className="text-gray-600 text-sm">reduction in delays</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-4 bg-[#008096]">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-2 bg-white font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ color: "#008096" }}
              >
                Login
              </Link>

              <Link
                  to="/signup"
                  className="inline-flex items-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 bg-white hover:bg-gray-100 shadow-md"
                  style={{ color: "#008096" }}
              >
                Registration Required
              </Link>
            </div>
          </div>
        </section>
      </div>
  );
}