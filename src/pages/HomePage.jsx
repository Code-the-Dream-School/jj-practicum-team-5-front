import React from "react";
import { Link } from "react-router-dom";

export default function HomePage({ fadeStart = 10 }) {
  return (
    <div className="min-h-screen flex flex-col overflow-y-auto">
      {/* Hero section with gradient blue strip background */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(171, 212, 246, 1) 0%,
                rgba(171, 212, 246, 0.9) 60%,
                rgba(171, 212, 246, 0.5) 80%,
                rgba(171, 212, 246, 0) 100%
              )
            `,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              Manage Projects
              <span className="block" style={{ color: "#007A8E" }}>
                Efficiently
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-2 max-w-3xl mx-auto leading-relaxed">
              Modern project management system that helps your team achieve
              goals faster and more organized
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-2 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                style={{
                  background: "linear-gradient(to right, #008096, #96007E)",
                }}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-2 font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-white"
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

      {/* Features + Why Choose Us wrapper with mycelium background */}
      <section className="relative">
        {/* Fade controlled by fadeStart prop */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to top,
                  rgba(255,255,255,0) ${fadeStart}%,
                  rgba(255,255,255,1) 100%
                ),
                url('/images/mycelium.webp')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Features section */}
          <div className="py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Everything You Need to Succeed
                </h2>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Comprehensive project management solution with intuitive
                  interface
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Task Management */}
                <div className="text-center p-8 rounded-2xl bg-white bg-opacity-90 hover:bg-gray-100 transition-all duration-200 shadow-md">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
                    style={{ backgroundColor: "#004C5A" }}
                  ></div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Task Management
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create, assign and track tasks with a convenient interface
                    and automated notifications
                  </p>
                </div>

                {/* Team Collaboration */}
                <div className="text-center p-4 rounded-2xl bg-white bg-opacity-90 hover:bg-gray-100 transition-all duration-200 shadow-md">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
                    style={{ backgroundColor: "#4C5A00" }}
                  ></div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Team Collaboration
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Unite teams, share files and communicate in real-time to
                    achieve common goals
                  </p>
                </div>

                {/* Project Planning */}
                <div className="text-center p-4 rounded-2xl bg-white bg-opacity-90 hover:bg-gray-100 transition-all duration-200 shadow-md">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
                    style={{ backgroundColor: "#5A004C" }}
                  ></div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Project Planning
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Plan timelines, set deadlines and track progress with
                    interactive charts and diagrams
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us section */}
          <div className="py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                    Why Choose Our System?
                  </h2>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Easy to Use",
                        text:
                          "Intuitive interface that requires no lengthy training",
                      },
                      {
                        title: "Flexible Configuration",
                        text: "Adapt the system to your business needs",
                      },
                      {
                        title: "Real-time Analytics",
                        text: "Get up-to-date data on project progress",
                      },
                      {
                        title: "Data Security",
                        text: "Reliable protection and backup of your data",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats box */}
                <div className="lg:pl-8">
                  <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-200 bg-opacity-90">
                    <div className="text-center">
                      <div
                        className="text-4xl font-bold mb-2"
                        style={{ color: "#B40098" }}
                      >
                        95%
                      </div>
                      <p className="text-gray-600 mb-2">
                        increase in team efficiency
                      </p>
                      <div
                        className="text-4xl font-bold mb-2"
                        style={{ color: "#B40098" }}
                      >
                        50%
                      </div>
                      <p className="text-gray-600">
                        reduction in project delays
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-2" style={{ backgroundColor: "#008096" }}>
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className=" md:text-2xl font-bold text-white mb-2">
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
              className="inline-flex items-center px-8 py-2 font-semibold rounded-xl transition-all duration-200 bg-white hover:bg-gray-100 shadow-md"
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
