import TimeLine from  "../components/TimeLine.jsx"

export default function HomePage() {
    const stepsFromAPI = [
        { id: 1, name: "Step 1", description: "First step description", status: "completed" },
        { id: 2, name: "Step 2", description: "Second step description", status: "in-progress" },
        { id: 3, name: "Step 3", description: "Third step description", status: "not started" },
        { id: 4, name: "Step 4", description: "Fourth step description", status: "not started" },
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ maxWidth: "600px", textAlign: "center", margin: "2rem 0" }}>
                A smart assistant for managing projects with integration of calendars and task trackers.
            </p>
            <p style={{ color: "gray", fontStyle: "italic", textAlign: "center" }}>
                Please log in to access the full functionality.
            </p>
            <TimeLine steps={stepsFromAPI} />
        </div>
    );
}
