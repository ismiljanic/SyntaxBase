import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';

export function ShowCase1Lesson5() {
    const [jsxContent, setJsxContent] = useState(`function Welcome() {
    return <h1>Hello, World!</h1>;
}

// Render the component
ReactDOM.render(<Welcome />, document.getElementById('root'));
    `);

    const updateIframe = () => {
        const iframe = document.getElementById('iframeResult') as HTMLIFrameElement | null;
        if (iframe) {
            iframe.srcdoc = `
                <div id="root"></div>
                <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <script type="text/babel">
                    ${jsxContent}
                </script>
            `;
        }
    };

    return (
        <div className="container">
            <div className="leftPane">
                <h2 className="heading">JSX Code Editor</h2>

                <CodeMirror
                    value={jsxContent}
                    extensions={[javascript({ jsx: true })]}
                    onChange={(value: React.SetStateAction<string>) => setJsxContent(value)}
                    theme="dark"
                    height="950px"
                    className="codeMirror"
                />

                <button className="button" onClick={updateIframe}>Run JSX</button>
            </div>

            <div className="rightPane">
                <h3 className="heading">Output</h3>
                <iframe
                    id="iframeResult"
                    className="iframe"
                    title="Output"
                ></iframe>
            </div>
        </div>
    );
}
