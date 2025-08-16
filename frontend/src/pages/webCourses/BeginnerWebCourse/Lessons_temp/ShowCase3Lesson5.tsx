import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';
import { transform } from '@babel/standalone';

export function ShowCase3Lesson5() {
    const [jsxContent, setJsxContent] = useState(`interface GreetingProps {
    name: string;
}

function Greeting({ name }: GreetingProps) {
    return <h1>Hello, {name}!</h1>;
}

// Render the objects and variables dynamically
ReactDOM.render(
    <Greeting name="Ivan" />,
    document.getElementById('root')
);
    `);

    const updateIframe = () => {
        const iframe = document.getElementById('iframeResult') as HTMLIFrameElement | null;
        if (iframe) {
            const transpiledCode = transform(jsxContent, {
                presets: ['typescript', 'react'],
                filename: 'file.tsx'
            }).code;

            iframe.srcdoc = `
                <div id="root"></div>
                <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
                <script>
                    ${transpiledCode}
                </script>
            `;
        }
    };

    return (
        <div className="container">
            <div className="leftPane">
                <h2 className="heading">TypeScript Code Editor</h2>

                <CodeMirror
                    value={jsxContent}
                    extensions={[javascript({ jsx: true })]}
                    onChange={(value: React.SetStateAction<string>) => setJsxContent(value)}
                    theme="dark"
                    height="950px"
                    className="codeMirror"
                />

                <button className="button" onClick={updateIframe}>Run TypeScript</button>
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
