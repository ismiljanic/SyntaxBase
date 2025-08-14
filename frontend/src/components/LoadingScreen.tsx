export default function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div>
                <div className="spinner"></div>
            </div>
            <p className="loading-text" style={{marginTop: '-5em', color: '#4a90e2', marginLeft: '-5em', fontSize: '1.3em'}}>Loading SyntaxBase...</p>
        </div>
    );
}