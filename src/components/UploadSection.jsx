import { useState } from 'react';

export default function UploadSection() {
  // State to hold the uploaded file and the selected project stage
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState('idea');

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
    alert(`Submitting ${file.name} at the '${stage}' stage for AI Criticism!`);
    // Later on, this is where we will send the file to the AI backend
  };

  return (
    <div style={{ padding: '4rem 2rem', borderTop: '1px solid gray', marginTop: '2rem' }}>
      
      <h2>Upload for AI Criticism</h2>
      <p>Select your file and tell us what stage your project is currently in.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        
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

    </div>
  );
}
