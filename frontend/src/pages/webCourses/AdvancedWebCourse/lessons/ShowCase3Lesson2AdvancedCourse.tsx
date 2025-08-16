import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

type MouseTrackerProps = {
  render: (x: number, y: number) => React.ReactNode;
};

function MouseTracker({ render }: MouseTrackerProps) {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  return (
    <div
      onMouseMove={(e) => {
        setX(e.clientX);
        setY(e.clientY);
      }}
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {render(x, y)}
    </div>
  );
}

export default function ShowCase3Lesson2AdvancedCourse() {
  const code = `function MouseTracker({ render }) {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  return (
    <div onMouseMove={e => { setX(e.clientX); setY(e.clientY); }}>
      {render(x, y)}
    </div>
  );
}

function App() {
  return <MouseTracker render={(x, y) => <p>Mouse at ({x}, {y})</p>} />;
}`;

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>Render Props - Try it yourself</h2>
        <CodeMirror
          value={code}
          extensions={[javascript({ jsx: true })]}
          height="400px"
          theme="dark"
        />
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          border: '1px solid #ddd',
          height: '400px',
        }}
      >
        <MouseTracker render={(x, y) => <p>Mouse at ({x}, {y})</p>} />
      </div>
    </div>
  );
}