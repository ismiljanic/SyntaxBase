import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';
import { transform } from '@babel/standalone';

export function ShowCase4Lesson5() {
    const [jsxContent, setJsxContent] = useState(`function Counter() {
    const [count, setCount] = React.useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

// Render the Counter component dynamically
ReactDOM.render(
    <Counter />,
    document.getElementById('root')
);
`);

    const updateIframe = () => {
        const iframe = document.getElementById('iframeResult') as HTMLIFrameElement | null;
        if (iframe) {
            const transpiledCode = transform(jsxContent, {
                presets: ['react'],
                plugins: ['transform-react-jsx'],
            }).code;

            iframe.srcdoc = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Output</title>
                </head>
                <body>
                    <div id="root"></div>
                    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
                    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
                    <script>
                        try {
                            ${transpiledCode}
                        } catch (error) {
                            console.error('Error executing script:', error); // Catch and log errors
                        }
                    </script>
                </body>
                </html>
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
