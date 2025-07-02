import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { SalesAgentContext } from "../contexts/SalesAgentProvider";
import SalesAgentProvider from "../contexts/SalesAgentProvider";


const LeadsBySalesAgents = ({salesAgentId, salesAgentName}) => {
    const [filteredLeads, setFilteredLeads] = useState(null);
    const [displayFilteredLeads, setDisplayFilteredLeads] = useState(false);
    const [highlight, setHighlight] = useState(false);
    const [filter, setFilter] = useState({ salesAgent: salesAgentId});
    const [error, setError] = useState(null);
    const [sortedLeads, setSortedLeads] = useState(null);

    const CardComponent = ({color}) => {
        return (
            <div className="card" style={{ backgroundColor: color, cursor: "pointer" }} onMouseEnter={() => setHighlight(true)} onMouseLeave={() => setHighlight(false)} onClick={() => {
                if (displayFilteredLeads) {
                    setDisplayFilteredLeads(false);
                } else {
                    setDisplayFilteredLeads(true);
                }
            }}>
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <p className="fs-5 fw-medium"><i className="bi bi-person"></i> Sales Agent: {salesAgentName} ({filteredLeads?.length} Leads)</p>
                        {displayFilteredLeads ? <i className="bi bi-chevron-up" style={{ fontSize: "30px"}}></i> : <i className="bi bi-chevron-down" style={{ fontSize: "30px"}}></i>}
                    </div>
                </div>
            </div>
        )
    }

    const LeadDetails = ({lead}) => {
        return (
            <>
                <div className="d-flex">
                    {lead.priority === "High" && <i className="bi bi-fire" style={{ color: "orangered" }}></i>}
                    {lead.priority === "Medium" && <i className="bi bi-exclamation-circle" style={{ color: "yellow" }}></i>}
                    {lead.priority === "Low" && <i className="bi bi-caret-down-fill" style={{ color: "black" }}></i>}
                    <div className="ms-4">
                        <p className="fs-5 fw-medium">{lead.name}</p>
                        <p className="fs-5" style={{ color: "grey"}}>Company: {lead.company}</p>
                    </div>
                </div>
                <div>
                    {lead.status === "New" && <span className="badge rounded-pill text-bg-primary">{lead.status}</span>}
                    {lead.status === "Contacted" && <span className="badge rounded-pill text-bg-warning">{lead.status}</span>}
                    {lead.status === "Qualified" && <span className="badge rounded-pill text-bg-success">{lead.status}</span>}
                    {lead.status === "Proposal Sent" && <span className="badge rounded-pill text-bg-secondary">{lead.status}</span>}
                    {lead.status === "Closed" && <span className="badge rounded-pill text-bg-danger">{lead.status}</span>}
                    <p className="fs-5">Value: <i className="bi bi-currency-dollar"></i>{lead.value} | Days to Close: {lead.timeToClose}</p>
                </div>
            </>
        )
    }

    const filterHandler = (event) => {
        setFilter((prevData) => ({...prevData, [event.target.name]: event.target.value }));
    }

    const sortHandler = (event) => {
        if (event.target.checked) {
            let leadsArray = filteredLeads.slice();
            leadsArray.sort((lead1, lead2) => lead1.timeToClose - lead2.timeToClose);
            setSortedLeads(leadsArray);
        } else {
            setSortedLeads(null);
        }
    }

    useEffect(() => {
        axios.get("https://anvaya-crm-backend-mu.vercel.app/leads/filter", { params: filter })
        .then((res) => {
            setFilteredLeads(res.data);
            setError(null);
        })
        .catch((error) => {
            setFilteredLeads(null)
            if (error.response) {
                if (error.response.status === 404) {
                    setError(error.response.data.message);
                } else if (error.response.status === 500) {
                    setError("Internal server error");
                }
            }
        })
    }, [filter]);

    return (
    <>
        {highlight ? <CardComponent color="lightblue" /> : <CardComponent color=""/>}
        {displayFilteredLeads && <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between">
                <div>
                    <label className="form-label fs-5 fw-medium">Filter by Status</label>
                    <select className="form-select" name="status" onChange={filterHandler}>
                        <option value="">All</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
                <div>
                    <label className="form-label fs-5 fw-medium">Filter by Priority</label>
                    <select className="form-select" name="priority" onChange={filterHandler}>
                        <option value="">All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="form-check-input">
                    <input
                    type="checkbox"
                    className="form-check-input border border-black"
                    style={{ fontSize: "30px"}}
                    onChange={sortHandler}
                    />
                    <label className="form-label fs-5 fw-medium ms-3">Sort by Time to Close <i className="bi bi-clock ms-3" style={{ fontSize: "30px", color: "blue"}}></i></label>
                </div>
            </li>
            {error && <li className="list-group-item fs-5 fw-medium text-center">{error}</li>}
            {! sortedLeads  ? <>
              {filteredLeads?.map((lead) => {
                return (
                    <li className="list-group-item d-flex justify-content-between" key={lead._id}>
                       <LeadDetails lead={lead}/>
                    </li>
                )
            })}
            </> : <>
              {sortedLeads?.map((lead) => {
                return (
                    <li className="list-group-item d-flex justify-content-between" key={lead._id}>
                       <LeadDetails lead={lead}/>
                    </li>
                )
            })}
            </>}
        </ul>}
    </>
    )
}

const DisplayLeadsBySalesAgent = () => {
    const { salesAgents } = useContext(SalesAgentContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
    <>
        <p className="fs-4 fw-medium">Leads By Sales Agents</p>
        {loading && <div className="spinner-border text-primary position-fixed top-50 start-50"></div>}
        {! loading && <div>
              {salesAgents?.map((agent) => {
                return (
                    <div className="row py-2" key={agent._id}>
                        <LeadsBySalesAgents salesAgentId={agent._id} salesAgentName={agent.name}/>
                    </div>
                )
              })}
        </div>}
    </>
    )
}

const LeadsBySalesAgentComponents = ({children}) => {
    return (
        <div>
            <header>
                <div className="row">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <p className="fs-3 fw-medium">Leads By Sales Agents</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="row">
                <div className="col-md-3">
                    <Link to="/"><i className="bi bi-arrow-left-short"></i>Back to Dashboard</Link>
                </div>
                <div className="col">
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

const LeadsBySalesAgentPage = () => {
    return (
        <LeadsBySalesAgentComponents>
            <SalesAgentProvider>
                <DisplayLeadsBySalesAgent/>
            </SalesAgentProvider>
        </LeadsBySalesAgentComponents>
    )
}

export default LeadsBySalesAgentPage