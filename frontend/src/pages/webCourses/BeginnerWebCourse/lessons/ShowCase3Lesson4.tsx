import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';

export function ShowCase3Lesson4() {
    const [htmlContent, setHtmlContent] = useState(`
<!DOCTYPE html>
<html>
<head>
    <title>Padding and Margin Examples</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center; /* Center align text */
            margin: 20px; /* Margin around the body */
        }
        .box {
            margin: 10px; /* Default margin for all boxes */
            padding: 20px; /* Padding inside each box */
            background-color: lightblue; /* Box background color */
            border: 1px solid #ccc; /* Border for visibility */
        }
        /* Example 1: Basic Box */
        .example1 {
            background-color: lightcoral; /* Different background color */
        }
        /* Example 2: Box with Larger Margin */
        .example2 {
            margin: 30px; /* Larger margin */
            padding: 10px; /* Smaller padding */
        }
        /* Example 3: Box with Specific Margins */
        .example3 {
            margin: 20px 0; /* Vertical margins */
            padding: 40px; /* Larger padding */
        }
        /* Example 4: Box with Margin Collapse */
        .example4 {
            margin-top: 50px; /* Extra space above this box */
            padding: 10px; /* Normal padding */
            background-color: lightgreen; /* Different background color */
        }
    </style>
</head>
<body>
    <h1>Padding and Margin Examples</h1>
    
    <!-- Example 1: Basic Box -->
    <div class="box example1">Example 1: Basic Box</div>
    
    <!-- Example 2: Box with Larger Margin -->
    <div class="box example2">Example 2: Box with Larger Margin</div>
    
    <!-- Example 3: Box with Specific Margins -->
    <div class="box example3">Example 3: Box with Specific Margins</div>
    
    <!-- Example 4: Box with Margin Collapse -->
    <div class="box example4">Example 4: Box with Margin Collapse</div>

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
