export default function HomePage() {

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
            <p className="max-w-xl text-center my-8">
                A smart assistant for managing projects with integration of calendars and task trackers.
            </p>
            <p style={{ color: "gray", fontStyle: "italic", textAlign: "center" }}>
                Please log in to access the full functionality.
            </p>
        </div>
    );
}
