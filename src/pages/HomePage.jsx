export default function HomePage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ maxWidth: "600px", textAlign: "center", margin: "2rem 0" }}>
                A smart assistant for managing projects with integration of calendars and task trackers.
            </p>
            <p style={{ color: "gray", fontStyle: "italic", textAlign: "center" }}>
                You must be logged in to use the project management features.
            </p>
        </div>
    );
}
