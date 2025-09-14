import React from "react";
import { Link } from "react-router-dom";

export default function HomePage({ fadeStart = 10 }) {
  return (
      <div className="flex flex-col ">
        {/* Hero */}
        <section className="relative flex-shrink-0">
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
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-2 md:py-2 z-10">
            <div className="text-center">
              <h1 className="text-2xl sm:text-xl md:text-xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                Manage Projects
                <span className="block mt-2 text-[#007A8E]">Efficiently</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
                Modern project management system that helps your team achieve
                goals faster and more organized
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/login"
                    className="px-8 py-2 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-lg"
                    style={{
                      background: "linear-gradient(to right, #008096, #96007E)",
                    }}
                >
                  Login
                </Link>
                <Link
                    to="/signup"
                    className="px-8 py-2 text-white font-semibold rounded-xl shadow-md hover:shadow-lg text-lg"
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
        <section className="relative flex-0">
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

          <div className="relative z-10 pb-8 md:pb-4">
            {/* Features */}
            <div className="py-8 sm:py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Everything You Need to Succeed
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                    Comprehensive project management solution with intuitive
                    interface
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { icon: "📋", bg: "#004C5A", title: "Task Management", text: "Create, assign and track tasks efficiently" },
                    { icon: "👥", bg: "#4C5A00", title: "Team Collaboration", text: "Unite teams and share files seamlessly" },
                    { icon: "📊", bg: "#5A004C", title: "Project Planning", text: "Plan timelines and monitor progress" },
                  ].map((f, i) => (
                      <div
                          key={i}
                          className="text-center p-8 rounded-2xl bg-white bg-opacity-90 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                            style={{ backgroundColor: f.bg }}
                        >
                          <span className="text-white text-3xl">{f.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{f.text}</p>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-4 sm:py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl sm:text-xl md:text-2xl font-bold mb-4">
                    Why Choose Our System?
                  </h2>
                  <div className="space-y-3">
                    {[
                      { icon: "✨", title: "Easy to Use", text: "No lengthy training required - start immediately" },
                      { icon: "⚙️", title: "Flexible Configuration", text: "Adapt the system to your unique needs" },
                      { icon: "📈", title: "Real-time Analytics", text: "Get up-to-date project progress insights" },
                      { icon: "🔒", title: "Data Security", text: "Enterprise-grade protection and backup" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start space-x-4 p-6 bg-white bg-opacity-90 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                          <div className="flex-shrink-0 w-12 h-12 bg-[#007A8E] bg-opacity-10 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">{item.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{item.text}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white bg-opacity-95 border border-gray-200 rounded-2xl shadow-xl p-8">
                  <div className="text-center space-y-8">
                    <div>
                      <div className="text-4xl sm:text-3xl font-bold text-[#B40098] mb-2">95%</div>
                      <p className="text-gray-600 text-lg">increase in efficiency</p>
                    </div>
                    <div className="border-t border-gray-200 pt-6">
                      <div className="text-4xl sm:text-3xl font-bold text-[#B40098] mb-2">50%</div>
                      <p className="text-gray-600 text-lg">reduction in delays</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 py-2 bg-[#008096] flex-shrink-0">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              Ready to Get Started?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  style={{ color: "#008096" }}
              >
                Login
              </Link>
              <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 font-bold rounded-xl transition-all duration-200 bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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