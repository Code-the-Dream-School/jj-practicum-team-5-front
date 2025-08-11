import TimeLine from  "../components/TimeLine.jsx"

export default function HomePage() {
    const stepsFromAPI = [
        { id: 1, name: "Step 1", description: "First step description", status: "completed" },
        { id: 2, name: "Step 2", description: "Second step description", status: "in-progress" },
        { id: 3, name: "Step 3", description: "Third step description", status: "not started" },
        { id: 4, name: "Step 4", description: "Fourth step description", status: "overdue" },
    ];
    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
            <p className="max-w-xl text-center my-8">
                A smart assistant for managing projects with integration of calendars and task trackers.
            </p>
            <p style={{ color: "gray", fontStyle: "italic", textAlign: "center" }}>
                Please log in to access the full functionality.
            </p>
            <TimeLine steps={stepsFromAPI} />
        </div>
    );
}
