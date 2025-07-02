import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const [backgroundColor, setBackgroundColor] = useState(false);
    const [navElement, setNavElement] = useState("");
    return (
        <ul className="nav flex-column py-4">
            <li className="nav-item">
                {(backgroundColor && navElement === "Leads") ? <NavLink to="/leads" className="nav-link fs-5 fw-medium" style={{ color: "black", backgroundColor: "lightblue"}} onMouseLeave={() => {
                    setBackgroundColor(false);
                    setNavElement("")
                }}><i className="bi bi-people"></i> Leads</NavLink> : <NavLink to="/leads" className="nav-link fs-5 fw-medium" style={{ color: "black"}} onMouseEnter={() => {
                    setBackgroundColor(true);
                    setNavElement("Leads")
                }}><i className="bi bi-people"></i> Leads</NavLink>}
            </li>
          <li className="nav-item mt-4">
                {(backgroundColor && navElement === "Sales") ? <NavLink className="nav-link fs-5 fw-medium" style={{ color: "black", backgroundColor: "lightblue"}} onMouseLeave={() => {
                    setBackgroundColor(false);
                    setNavElement("")
                }}><i className="bi bi-graph-up-arrow"></i> Sales</NavLink> : <NavLink className="nav-link fs-5 fw-medium" style={{ color: "black"}} onMouseEnter={() => {
                    setBackgroundColor(true);
                    setNavElement("Sales")
                }}><i className="bi bi-graph-up-arrow"></i> Sales</NavLink>}
            </li>
           <li className="nav-item mt-4">
                {(backgroundColor && navElement === "Agents") ? <NavLink to="/salesAgents" className="nav-link fs-5 fw-medium" style={{ color: "black", backgroundColor: "lightblue"}} onMouseLeave={() => {
                    setBackgroundColor(false);
                    setNavElement("")
                }}><i className="bi bi-people"></i> Agents</NavLink> : <NavLink to="/salesAgents" className="nav-link fs-5 fw-medium" style={{ color: "black"}} onMouseEnter={() => {
                    setBackgroundColor(true);
                    setNavElement("Agents")
                }}><i className="bi bi-people"></i> Agents</NavLink>}
            </li>
           <li className="nav-item mt-4">
                {(backgroundColor && navElement === "Report") ? <NavLink to="/report" className="nav-link fs-5 fw-medium" style={{ color: "black", backgroundColor: "lightblue"}} onMouseLeave={() => {
                    setBackgroundColor(false);
                    setNavElement("")
                }}><i className="bi bi-bar-chart-fill"></i> Report</NavLink> : <NavLink to="/report" className="nav-link fs-5 fw-medium" style={{ color: "black"}} onMouseEnter={() => {
                    setBackgroundColor(true);
                    setNavElement("Report")
                }}><i className="bi bi-bar-chart-fill"></i> Report</NavLink>}
            </li>
            <li className="nav-item mt-4">
                {(backgroundColor && navElement === "Settings") ? <NavLink className="nav-link fs-5 fw-medium" style={{ color: "black", backgroundColor: "lightblue"}} onMouseLeave={() => {
                    setBackgroundColor(false);
                    setNavElement("")
                }}><i className="bi bi-gear"></i> Settings</NavLink> : <NavLink className="nav-link fs-5 fw-medium" style={{ color: "black"}} onMouseEnter={() => {
                    setBackgroundColor(true);
                    setNavElement("Settings")
                }}><i className="bi bi-gear"></i> Settings</NavLink>}
            </li>
        </ul>
    )
}

export default Navbar