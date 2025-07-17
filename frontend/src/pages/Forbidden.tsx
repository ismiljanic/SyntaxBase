import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="errorNotFound">
      <h1 style={{ fontSize: '4em', paddingTop: '4em' }}><b>403 - You do not have permission to view this page.</b></h1>
      <p style={{ fontSize: '1.2em' }}>Don’t worry, we’ll get you back on track. Head back to the <Link to="/" style={{ color: '#007bff' }}>Homepage</Link> and start fresh.</p>
    </div>
  )
}