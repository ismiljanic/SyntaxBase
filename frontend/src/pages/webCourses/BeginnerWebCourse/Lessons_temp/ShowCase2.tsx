import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';

export function ShowCase2() {
    const [htmlContent, setHtmlContent] = useState(`<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>Paragraph with <strong>bold</strong> word.</p>
<p>This is a <br> paragraph with a line break.</p>

</body>
</html>`);

    const updateIframe = () => {
        const iframe = document.getElementById('iframeResult') as HTMLIFrameElement | null;
        if (iframe) {
            iframe.srcdoc = htmlContent;
        }
    };

    return (
        <div className="container">
            <div className="leftPane">
                <h2 className="heading">HTML Code Editor</h2>

                <CodeMirror
                    value={htmlContent}
                    extensions={[html()]}
                    onChange={(value: React.SetStateAction<string>) => setHtmlContent(value)}
                    theme="dark"
                    height="950px"
                    className="codeMirror"
                />

                <button className="button" onClick={updateIframe}>Run HTML</button>
            </div>

            <div className="rightPane">
                <h3 className="heading">Output</h3>
                <iframe
                    id="iframeResult"
                    className="iframe"
                    srcDoc={htmlContent}
                    title="Output"
                ></iframe>
            </div>
        </div>
    );
}
