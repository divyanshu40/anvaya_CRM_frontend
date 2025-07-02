import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import SalesAgentProvider from "../contexts/SalesAgentProvider";
import { SalesAgentContext } from "../contexts/SalesAgentProvider";
import axios from "axios";

const LeadsByStatus = ({leadsStatus}) => {
    const { salesAgents } = useContext(SalesAgentContext);
    const [filteredLeads, setFilteredLeads] = useState(null);
    const [error, setError] = useState(null);
    const [highlight, setHighlight] = useState(false);
    const [displayLeadsList, setDisplayLeadsList] = useState(false);
    const [filter, setFilter] = useState({ status: leadsStatus});
    const [sortedLeads, setSortedLeads] = useState(null);

    const filterHandler = (event) => {
        setFilter((prevData) => ({...prevData, [event.target.name]: event.target.value }));
        setFilteredLeads(null);
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

    const CardComponent = ({color}) => {
        return (
        <div className="card" style={{ backgroundColor: color, cursor: "pointer"}} onMouseEnter={() => setHighlight(true)} onMouseLeave={() => setHighlight(false)} onClick={() => {
            if (displayLeadsList) {
                setDisplayLeadsList(false);
            } else {
                setDisplayLeadsList(true);
            }
           }}>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        {leadsStatus === "New" && <span className="badge rounded-pill text-bg-primary" style={{ height: "30px"}}>{leadsStatus}</span>}
                        {leadsStatus === "Contacted" && <span className="badge rounded-pill text-bg-warning" style={{ height: "30px"}}>{leadsStatus}</span>}
                        {leadsStatus === "Qualified" && <span className="badge rounded-pill text-bg-success" style={{ height: "30px"}}>{leadsStatus}</span>}
                        {leadsStatus === "Proposal Sent" && <span className="badge rounded-pill text-bg-secondary" style={{ height: "30px"}}>{leadsStatus}</span>}
                        {leadsStatus === "Closed" && <span className="badge rounded-pill text-bg-danger" style={{ height: "30px"}}>{leadsStatus}</span>}
                        <p className="fs-5 fw-medium ms-4">{filteredLeads?.length} Leads</p>
                    </div>
                    {displayLeadsList ? <i className="bi bi-chevron-up" style={{ fontSize: "30px"}}></i> : <i className="bi bi-chevron-down" style={{ fontSize: "30px"}}></i>}
                </div>
            </div>
        </div>
        )
    }

    const LeadDetails = ({ lead }) => {
        return (
        <>
            <div className="d-flex">
                {lead.priority === "High" && <i className="bi bi-fire" style={{ color: "orangered"}}></i>}
                {lead.priority === "Medium" && <i className="bi bi-exclamation-circle" style={{ color: "yellow"}}></i>}
                {lead.priority === "Low" && <i className="bi bi-chevron-down-fill" style={{ color: "black"}}></i>}
                <div className="ms-4">
                    <p className="fs-5 fw-medium">{lead.name}</p>
                    <p className="fs-5" style={{ color: "grey"}}>Company: {lead.company}</p>
                </div>
            </div>
            <div>
                <p className="fs-5">Agent: {lead.salesAgent.name}</p>
                <p className="fs-5" style={{ color: "grey"}}><i className="bi bi-currency-dollar"></i>{lead.value} | Days to Close: {lead.timeToClose}</p>
            </div>
        </>
        )
    }

    useEffect(() => {
        axios.get("https://anvaya-crm-backend-mu.vercel.app/leads/filter", { params:filter })
        .then((res) => {
            setFilteredLeads(res.data);
            setError(null);
        })
        .catch((error) => {
            setFilteredLeads(null);
            if (error.response) {
                if (error.response.status === 404) {
                    setError(error.response.data.message);
                } else if (error.response.status === 500) {
                    setError("Internal server error");
                }
            }
        })
    }, [filter])

    return (
    <>
        {highlight ? <CardComponent color="lightblue"/> : <CardComponent color=""/>}
        {displayLeadsList && <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between">
                <div>
                    <label className="fs-5 fw-medium"><i className="bi bi-person"></i>Filter by Sales Agents</label>
                    <select className="form-select" name="salesAgent" onChange={filterHandler}>
                        <option value="">All Sales Agents</option>
                        {salesAgents?.map((agent) => {
                            return (
                                <option value={agent._id} key={agent._id}>{agent.name}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <label className="fs-5 fw-medium"><i className="bi bi-filter"></i>Filter by Priority</label>
                    <select className="form-select" name="priority" onChange={filterHandler}>
                        <option value="">All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="form-check d-flex align-items-center">
                    <input
                    type="checkbox"
                    className="form-check-input border border-black"
                    style={{ fontSize: "30px", cursor: "pointer"}}
                    onChange={sortHandler}
                    />
                    <label className="form-check-label fs-5 fw-medium ms-3">Sort by Time to Close <i className="bi bi-clock ms-3" style={{ color: "blue", fontSize: "30px"}}></i></label>
                </div>
            </li>
            {error && <li className="list-group-item fs-5 fw-medium text-center">{error}</li>}
            {! sortedLeads ? <div>
               {filteredLeads?.map((lead) => {
                return (
                    <li className="list-group-item d-flex justify-content-between" key={lead._id}>
                       <LeadDetails lead={lead}/> 
                    </li>
                )
            })}
            </div> : <div>
               {sortedLeads?.map((lead) => {
                return (
                    <li className="list-group-item d-flex justify-content-between" key={lead._id}>
                        <LeadDetails lead={lead}/>
                    </li>
                )
            })}
            </div>}
        </ul>}
    </>
    )
}

const DisplayStatusWiseLeads = () => {
    const [loading, setLoading] = useState(true);
    let statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

    useEffect(() => {
        setLoading(false);
    }, []);
    return (
        <>
          <p className="fs-4 fw-medium">Leads By Status</p>
          {loading && <div className="spinner-border text-primary position-fixed top-50 start-50"></div>}
          {! loading && <div>
               {statuses.map((status) => {
                return (
                    <div className="row py-2" key={status}>
                        <div className="col">
                            <LeadsByStatus leadsStatus={status}/>
                        </div>
                    </div>
                )
               })}
            </div>}
        </>
    )
}

const LeadsByStatusComponents = ({children}) => {
    return (
        <>
          <header>
            <div className="row">
                <div className="card">
                    <div className="card-body">
                        <p className="fs-3 fw-medium">Leads By Status</p>
                    </div>
                </div>
            </div>
          </header>
          <div className="row">
            <div className="col-md-3 py-4">
                <Link to="/" className="link-offset-2 link-underline link-underline-opacity-0 ms-4 fs-5 fw-medium"><i className="bi bi-arrow-left-short"></i>Back to Dashboard</Link>
            </div>
            <div className="col bg-light py-4">
                <div className="container">
                    {children}
                </div>
            </div>
          </div>
        </>
    )
}

const LeadsByStatusPage = () => {
    return (
        <LeadsByStatusComponents>
            <SalesAgentProvider>
                <DisplayStatusWiseLeads/>
            </SalesAgentProvider>
        </LeadsByStatusComponents>
    )
}

export default LeadsByStatusPage