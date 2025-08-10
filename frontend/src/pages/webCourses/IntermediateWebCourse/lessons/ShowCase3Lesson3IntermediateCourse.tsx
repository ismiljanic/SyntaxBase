import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ShowCase3Lesson3IntermediateCourse() {
  const code = `import React, { useState } from 'react';

export default function SimpleForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    alert(\`Submitted: \${name}\`);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}`;

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>Form with Validation</h2>
        <CodeMirror
          value={code}
          extensions={[javascript({ jsx: true })]}
          height="250px"
          theme="dark"
        />
      </div>
      <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '5px', border: '1px solid #ddd' }}>
        <FormPreview />
      </div>
    </div>
  );
}

function FormPreview() {
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    alert(`Submitted: ${name}`);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
