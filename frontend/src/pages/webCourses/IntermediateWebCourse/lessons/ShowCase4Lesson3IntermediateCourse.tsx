import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ShowCase4Lesson3IntermediateCourse() {
  const code = `import React, { useState, memo } from 'react';

const Display = memo(({ count }) => {
  console.log('Display rendered');
  return <p>Count: {count}</p>;
});

export default function OptimizedCounter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  return (
    <div>
      <Display count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type something" />
    </div>
  );
}`;

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>Optimized Counter (React.memo)</h2>
        <CodeMirror
          value={code}
          extensions={[javascript({ jsx: true })]}
          height="300px"
          theme="dark"
        />
      </div>
      <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '5px', border: '1px solid #ddd' }}>
        <OptimizedCounterPreview />
      </div>
    </div>
  );
}

type DisplayProps = { count: number };

const Display = React.memo(({ count }: DisplayProps) => {
  console.log('Display rendered');
  return <p>Count: {count}</p>;
});

function OptimizedCounterPreview() {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState('');

  return (
    <div>
      <Display count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type something" />
    </div>
  );
}
