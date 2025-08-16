import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';

export function ShowCase1Lesson4() {
    const [htmlContent, setHtmlContent] = useState(`
<!DOCTYPE html>
<html>
<head>
    <title>Margin Examples</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center; /* Center align text */
            margin: 20px; /* Margin around the body */
        }
        .box {
            margin: 10px; /* Default margin for all boxes */
            padding: 20px; /* We can also add padding inside each box */
            background-color: lightblue; /* Box background color */
            border: 1px solid #ccc; /* Border for visibility */
        }
        .box.large {
            margin: 20px; /* Larger margin for this box */
        }
        .box.special {
            margin-top: 50px; /* Extra space above this box */
        }
    </style>
</head>
<body>
    <h1>Margin Examples</h1>
    <div class="box">Box 1</div>
    <div class="box large">Box 2 (Larger Margin)</div>
    <div class="box special">Box 3 (Extra Top Margin)</div>
    <div class="box">Box 4</div>
</body>
</html>
`);



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
