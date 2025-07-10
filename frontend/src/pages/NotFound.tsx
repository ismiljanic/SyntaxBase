import { Link } from "react-router-dom";
import '../styles/NotFound.css'

export default function NotFound() {
    return (
        <div className="errorNotFound">
            <h1 style={{fontSize: '4em', paddingTop: '4em'}}><b>Error 404 - You've ventured too far!</b></h1>
            <p style={{fontSize: '1.2em'}}>Don’t worry, we’ll get you back on track. Head back to the <Link to="/" style={{color: '#007bff'}}>Homepage</Link> and start fresh.</p>
        </div>
    )
}
