import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="errorNotFound">
      <h1 style={{ fontSize: '4em', paddingTop: '4em' }}><b>401 - Please log in to access this page.</b></h1>
      <p style={{ fontSize: '1.2em' }}>You can log in <Link to="/login" style={{ color: '#007bff' }}>here</Link> and start fresh.</p>
    </div>
  )
}