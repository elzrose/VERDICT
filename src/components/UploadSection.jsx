import { useState } from 'react';

const mockAIResponse = [
    {
        id: 'overview',
        category: 'Overview & Scores',
        title: 'Project: "The Next Big Thing" 🚀',
        tagline: '"A brilliant idea wrapped in slightly confusing execution." - Verdict AI',
        content: (
            <div>
                <p><strong>UI/UX Design:</strong> 6/10 - Needs more padding and modern fonts.</p>
                <p><strong>Frontend:</strong> 8/10 - Solid React structure, but animations are sluggish.</p>
                <p><strong>Backend:</strong> 5/10 - Your database queries might bottleneck at scale.</p>
                <p><strong>Creativity:</strong> 9/10 - Unique concept that stands out!</p>
            </div>
        )
    },
    {
        id: 'feedback',
        category: 'Brutal Feedback',
        title: 'What is Wrong & What is Good',
        tagline: 'Time for the roast...',
        content: (
            <div>
                <h4 style={{ color: 'red' }}>The Bad:</h4>
                <ul>
                    <li>Users will get lost on your navigation bar. Too many links!</li>
                    <li>Dark mode contrast is too low; it hurts my AI eyes.</li>
                </ul>
                <h4 style={{ color: 'green' }}>The Good:</h4>
                <ul>
                    <li>The core feature (the file uploader) works flawlessly.</li>
                    <li>Great use of modern Javascript methods.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'competitors',
        category: 'Market & Competitors',
        title: 'How to Stand Out',
        tagline: 'You are not alone in this market.',
        content: (
            <div>
                <p><strong>Competitors:</strong> App X, Service Y, Tool Z.</p>
                <p><strong>How to Beat Them:</strong> They charge too much. Make yours freemium and focus entirely on mobile users first.</p>
                <p><strong>Suggestion:</strong> Add a community feature so users can roast each other's apps too.</p>
            </div>
        )
    },
    {
        id: 'roastcard',
        category: 'RoastCard',
        title: 'The Roast Card',
        tagline: 'Time to get roasted!',
        content: (
            <div>
                <p>skill issues, git gud</p>
            </div>
        )
    }
];


export default function UploadSection() {
    // State to hold the uploaded file and the selected project stage
    const [file, setFile] = useState(null);
    const [stage, setStage] = useState('idea');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    // Handle file selection
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents the page from refreshing
        if (!file) {
            alert("Please select a file first!");
            return;
        }
        setIsSubmitted(true);
    };
    return (
        <div style={{ padding: '4rem 2rem', borderTop: '1px solid gray', marginTop: '2rem' }}>

            <h2>Upload for AI Criticism</h2>
            <p>Select your file and tell us what stage your project is currently in.</p>

            {/* If NOT submitted, show the form */}
            {!isSubmitted ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                    {/* ... Keep your existing Form Input Code Here ... */}
                    {/* File Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Project File (Image/Code/PDF):</label>
                        <input type="file" onChange={handleFileChange} />
                    </div>

                    {/* Stage Selection Dropdown */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Project Stage:</label>
                        <select value={stage} onChange={(e) => setStage(e.target.value)} style={{ padding: '0.5rem', width: '100%' }}>
                            <option value="idea">Just an Idea / Concept</option>
                            <option value="ui">UI/UX Design Mockup</option>
                            <option value="mvp">Minimum Viable Product (MVP)</option>
                            <option value="live">Live Product</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" style={{ padding: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>
                        Submit for AI Criticism
                    </button>
                </form>
            ) : (
                /* If SUBMITTED, show the AI Results Dashboard */
                <div className="results-dashboard" style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>

                    {/* Mini-Navbar for jumping to specific cards */}
                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
                        {mockAIResponse.map((card, index) => (
                            <button
                                key={card.id}
                                onClick={() => setCurrentCardIndex(index)}
                                style={{
                                    fontWeight: currentCardIndex === index ? 'bold' : 'normal',
                                    color: currentCardIndex === index ? 'red' : 'black',
                                    cursor: 'pointer'
                                }}
                            >
                                {card.category}
                            </button>
                        ))}
                    </div>

                    {/* The Current Active Card */}
                    <div className="active-card" style={{ padding: '1rem', backgroundColor: '#f9f9f9', color: '#000', minHeight: '200px', borderRadius: '8px' }}>
                        <h2>{mockAIResponse[currentCardIndex].title}</h2>
                        <h4 style={{ fontStyle: 'italic', color: '#555' }}>{mockAIResponse[currentCardIndex].tagline}</h4>

                        <div style={{ marginTop: '1rem' }}>
                            {mockAIResponse[currentCardIndex].content}
                        </div>
                    </div>

                    {/* Next / Prev Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <button
                            disabled={currentCardIndex === 0}
                            onClick={() => setCurrentCardIndex(currentCardIndex - 1)}
                        >
                            ← Previous
                        </button>

                        <button
                            disabled={currentCardIndex === mockAIResponse.length - 1}
                            onClick={() => setCurrentCardIndex(currentCardIndex + 1)}
                        >
                            Next →
                        </button>
                    </div>

                    {/* Start Over Button */}
                    <button
                        onClick={() => setIsSubmitted(false)}
                        style={{ display: 'block', marginTop: '2rem', width: '100%', padding: '0.5rem' }}
                    >
                        Start Over (Upload Another)
                    </button>

                </div>
            )}


        </div>
    );
}
