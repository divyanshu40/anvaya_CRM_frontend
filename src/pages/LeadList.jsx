import { useState, useContext, useEffect, createContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LeadProvider from "../contexts/LeadProvider";
import { LeadContext } from "../contexts/LeadProvider";
import SalesAgentProvider from "../contexts/SalesAgentProvider";
import { SalesAgentContext } from "../contexts/SalesAgentProvider";

const DisplayComponentContext = createContext();

const FilterElements = () => {
    const { filteredLeads, 
        setFilteredLeads, 
        error, 
        setError, 
        loading, 
        setLoading, 
        displayAddNewLeadForm, 
        setDisplayAddNewLeadForm 
    } = useContext(LeadContext);
    const { salesAgents } = useContext(SalesAgentContext);
    const { sortLeads, 
        setSortLeads,
        filter, 
        setFilter,
        statusFilterOption,
        setStatusFilterOption,
        salesAgentFilterOption,
        setSalesAgentFilterOption,
        tagFilterOption,
        setTagFilterOption,
        sortBy,
        setSortBy 
    } = useContext(DisplayComponentContext);
    const { sortedLeads, setSortedLeads} = useContext(LeadContext);

    const filterHandler = (event) => {
       setFilter((prevData) => ({...prevData, [event.target.name]: event.target.value }));
       if (event.target.name === "status") {
        setStatusFilterOption(event.target.value)
       } else if (event.target.name === "salesAgent") {
        setSalesAgentFilterOption(event.target.value)
       } else if (event.target.name === "tags") {
        setTagFilterOption(event.target.value);
       }
    }

    const sortHandler = (event) => {
        if (event.target.value === "priority") {
            let leadsArray = filteredLeads.map((lead) => {
                if (lead.priority === "High") {
                    return {...lead, priority: 1 }
                } else if (lead.priority === "Medium") {
                    return {...lead, priority: 2 }
                } else if (lead.priority === "Low") {
                    return { ...lead, priority: 3 }
                }
            });
            leadsArray.sort((lead1, lead2) => lead1.priority - lead2.priority);
            setSortedLeads(() => {
                let array = leadsArray.map((lead) => {
                    if (lead.priority === 1) {
                        return {...lead, priority: "High" }
                    } else if (lead.priority === 2) {
                        return {...lead, priority: "Medium" }
                    } else if (lead.priority === 3) {
                        return {...lead, priority: "Low" }
                    }
                });
                return array
            });
        } else if (event.target.value === "timeToClose") {
            let leadsArray = filteredLeads.slice();
            leadsArray.sort((lead1, lead2) => lead1.timeToClose - lead2.timeToClose);
            setSortedLeads(leadsArray);
        } else if (! event.target.value) {
            setSortedLeads("");
            setSortLeads("")
            setSortBy("")
        }
    }

    useEffect(() => {
    setLoading(true);
    axios
        .get("https://anvaya-crm-backend-omega.vercel.app/leads/filter", { params: filter })
        .then((response) => {
            // Axios already gives you parsed data
            setFilteredLeads(response.data);
            if (sortLeads === true) {
                if (sortBy === "priority") {
                    let leadsArray = response.data.map((lead) => {
                        if (lead.priority === "High") {
                            return {...lead, priority: 1 }
                        } else if (lead.priority === "Medium") {
                            return {...lead, priority: 2 }
                        } else if (lead.priority === "Low") {
                            return {...lead, priority: 3 }
                        }
                    });
                    leadsArray.sort((lead1, lead2) => lead1.priority - lead2.priority);
                    setSortedLeads(() => {
                        let array = leadsArray.map((lead) => {
                    if (lead.priority === 1) {
                        return {...lead, priority: "High" }
                    } else if (lead.priority === 2) {
                        return {...lead, priority: "Medium" }
                    } else if (lead.priority === 3) {
                        return {...lead, priority: "Low" }
                    }
                   });
                       return array
                    })
                } else if (sortBy === "timeToClose") {
                    let leadsArray = response.data.slice();
                    leadsArray.sort((lead1, lead2) => lead1.timeToClose - lead2.timeToClose);
                    setSortedLeads(leadsArray);
                }
            }
            setError(null);
        })
        .catch((error) => {
            setFilteredLeads(null)
            // Axios error structure
            if (error.response) {
                if (error.response.status === 404) {
                    setError(new Error(error.response.data.message));
                } else if (error.response.status === 500) {
                    setError(new Error(error.response.data.error));
                } else {
                    setError(new Error("Something went wrong"));
                }
            } else {
                setError(error);
            }
        })
        .finally(() => {
            setLoading(false);
        });
}, [filter]);

    
    return (
        <div className="card mt-4">
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <p className="fw-medium fs-5"><i className="bi bi-funnel"></i> Filter by Status</p>
                        <div>
                            <select className="form-select" 
                            name="status"
                            value={statusFilterOption}
                            onChange={filterHandler}
                            >
                                <option value="">All Statuses</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Proposal Sent">Proposal Sent</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <p className="fw-medium fs-5"><i className="bi bi-person"></i> Filter by Agent</p>
                        <div>
                            <select
                            className="form-select"
                            name="salesAgent"
                            value={salesAgentFilterOption}
                            onChange={filterHandler}
                            >
                                <option value="">All Agents</option>
                                {salesAgents?.map((agent) => {
                                    return (
                                        <option value={agent._id} key={agent._id}>{agent.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <p className="fw-medium fs-5"><i className="bi bi-tags"></i>Filter by Tags</p>
                        <div>
                            <select
                            className="form-select"
                            name="tags"
                            value={tagFilterOption}
                            onChange={filterHandler}
                            >
                                <option value="">All Tags</option>
                                {[
                                    "retail", "smart", "consulting", "enterprise", "logistics",
                                    "tech", "software", "digital", "finance", "iot", "home",
                                    "startup", "ai", "education", "data", "analytics", "cloud",
                                    "saas", "marketing", "b2b", "eco", "green", "health",
                                ].map((ele) => {
                                 return (
                                         <option value={ele} key={ele}>{ele}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <p className="fs-5 fw-medium"><i className="bi bi-laptop"></i> Filter by Source</p>
                        <div>
                            <select
                            className="form-select"
                            name="source"
                            onChange={filterHandler}
                            >
                                <option value="">All Sources</option>
                                <option value="Website">Website</option>
                                <option value="Referral">Referral</option>
                                <option value="Cold Call">Cold Call</option>
                                <option value="Advertisement">Advertisement</option>
                                <option value="Email">Email</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <p className="fs-5 fw-medium"><i className="bi bi-sort-down-alt"></i>Sort By</p>
                        <div>
                            <select 
                            className="form-select"
                            value={sortBy} 
                            onChange={(event) => {
                                setSortLeads(true);
                                setSortBy(event.target.value)
                                sortHandler(event)
                            }}>
                                <option value="">--Select--</option>
                                <option value="priority">Priority</option>
                                <option value="timeToClose">Time to Close</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end py-4">
                    <button className="btn btn-primary" onClick={() => setDisplayAddNewLeadForm(true)}>+ Add New Lead</button>
                </div>
            </div>
        </div>
    )
}

const LeadList = ({obj, backgroundColor}) => {

    const { filteredLeads, 
        setFilteredLeads, 
        loading, 
        setLoading, 
        error
    } = useContext(LeadContext);
    const { sortLeads, setSortLeads, filter, setFilter, sortBy, setSortBy } = useContext(DisplayComponentContext);
    const { sortedLeads, setSortedLeads } = useContext(LeadContext);


    return (
             <div className="row py-2">
                        <div className="col-md-11">
                            <div className="card"  style={{ backgroundColor: backgroundColor}}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            {obj.priority === "High" && <p className="fs-4 fw-medium"><i className="bi bi-fire" style={{ color: "orangered"}}></i> {obj.name}</p>}
                                            {obj.priority === "Medium" && <p className="fs-4 fw-medium"><i className="bi bi-exclamation-circle" style={{ color: "yellow"}}></i> {obj.name}</p>}
                                            {obj.priority === "Low" && <p className="fs-4 fw-medium"><i className="bi bi-caret-down-fill" style={{ color: "black"}}></i> {obj.name}</p>}
                                        </div>
                                        <div>
                                            <p className="fs-5 fw-medium">Priority: {obj.priority}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <p className="fs-5 fw-medium"><i className="bi bi-buildings"></i> {obj.company}</p>
                                        </div>
                                        <div className="col">
                                            <p className="fs-5 fw-medium"><i className="bi bi-person"></i> {obj.salesAgent.name}</p>
                                        </div>
                                        <div className="col">
                                            <p className="fs-5 fw-mediium"><i className="bi bi-currency-dollar"></i>{obj.value}</p>
                                        </div>
                                        <div className="col">
                                            <p className="fs-5 fw-medium"><i className="bi bi-clock"></i> {obj.timeToClose}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    )
}

const DisplayLeads = () => {
    const { filteredLeads, 
        loading, 
        setLoading, 
        error, 
        updatedLeadData, 
        setUpdatedLeadData, 
        displayUpdateLeadForm, 
        setDisplayUpdateLeadForm,
        sortedLeads,
        setSortedLeads ,
        setFilteredLeads
    } = useContext(LeadContext);
    const [selectedLeadId, setSelectedLeadId] = useState("");
    const { 
        sortLeads,
        setSortLeads,
        setFilter,
        setStatusFilterOption,
        setSalesAgentFilterOption,
        setTagFilterOption
    } = useContext(DisplayComponentContext);

     const deleteLeadHandler = async (leadId) => {
        setLoading(true);
        try {
            let leadDeletingResponse = await fetch(`https://anvaya-crm-backend-omega.vercel.app/leads/delete/${leadId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (! leadDeletingResponse.ok) {
                throw new Error("Failed to delete lead");
            }
            let response = await fetch("https://anvaya-crm-backend-omega.vercel.app/leads");
            if (!response.ok) {
                throw new Error("Failed to fetch leads");
            }
            let responseData = await response.json();
            setFilteredLeads(responseData);
            setFilter({});
            setSortBy("");
            setSortLeads(false);
            setStatusFilterOption("");
            setSalesAgentFilterOption("");
            setTagFilterOption("");
            setLoading(false);
        } catch(error) {
            console.error('Error: ', error)
        }
    }

    
    return (
        <div className="py-4">
            {loading && <div className="spinner-border text-primary position-fixed top-50 start-50"></div>}
            {error && <p className="fs-5 fw-medium position-fixed top-50 start-50">{error.message}</p>}
            {!loading && <div>
                   {sortLeads ? <div className="row">
                    {sortedLeads?.map((obj) => {
                        return (
                            <div className="d-flex align-items-center"><div className="col-md-11">{selectedLeadId === obj._id ? <Link to={`/lead/${obj._id}`} className="link-offset-2 link-underline link-underline-opacity-0" onMouseLeave={() => setSelectedLeadId("")}>
                               <LeadList obj={obj} backgroundColor="lightblue"/>
                            </Link> : <Link to={`/lead/${obj._id}`} className="link-offset-2 link-underline link-underline-opacity-0" onMouseEnter={() => setSelectedLeadId(obj._id)}>
                               <LeadList obj={obj}/>
                            </Link>}</div>
                              <div className="col">
                             <div className="d-flex">
                                    <i className="bi bi-pencil fs-5 fw-medium" title="Edit" style={{ color: "blue", cursor: "pointer"}} onClick={() => {
                                                setUpdatedLeadData(obj);
                                                setFilter({});
                                                setSortBy("");
                                                setSortLeads(false);
                                                setStatusFilterOption("");
                                                setSalesAgentFilterOption("");
                                                setTagFilterOption("");
                                                setDisplayUpdateLeadForm(true);
                                    }}></i>
                                    <i className="bi bi-trash ms-4 fs-5 fw-medium" title="Delete" style={{ color: "red", cursor: "pointer"}} onClick={() => {
                                                deleteLeadHandler(obj._id)
                                    }}></i>
                                </div>
                        </div>
                            </div>
                        )
                    })}
                   </div> : <div className="row">
                       {filteredLeads?.map((obj) => {
                             return (
                            <div className="d-flex align-items-center"><div className="col-md-11">{selectedLeadId === obj._id ? <Link to={`/lead/${obj._id}`} className="link-offset-2 link-underline link-underline-opacity-0" onMouseLeave={() => setSelectedLeadId("")}>
                               <LeadList obj={obj} backgroundColor="lightblue"/>
                            </Link> : <Link to={`/lead/${obj._id}`} className="link-offset-2 link-underline link-underline-opacity-0" onMouseEnter={() => setSelectedLeadId(obj._id)}>
                               <LeadList obj={obj}/>
                            </Link>}</div>
                              <div className="col">
                             <div className="d-flex">
                                    <i className="bi bi-pencil fs-5 fw-medium" title="Edit" style={{ color: "blue", cursor: "pointer"}} onClick={() => {
                                                setUpdatedLeadData(obj);
                                                setDisplayUpdateLeadForm(true);
                                    }}></i>
                                    <i className="bi bi-trash ms-4 fs-5 fw-medium" title="Delete" style={{ color: "red", cursor: "pointer"}} onClick={() => {
                                                deleteLeadHandler(obj._id)
                                    }}></i>
                                </div>
                        </div>
                            </div>
                            )
                       })}
                    </div>}
                </div>}
        </div>
    )
}

const DisplayComponents = ({children}) => {
    const [sortLeads, setSortLeads] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [filter, setFilter] = useState({});
    const [statusFilterOption, setStatusFilterOption] = useState("");
    const [salesAgentFilterOption, setSalesAgentFilterOption] = useState("");
    const [tagFilterOption, setTagFilterOption] = useState("");
    return (
       <div>
         <div className="row">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <p className="fs-2 fw-medium">Lead List</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-3">
                <div className="mt-5 ms-4">
                    <Link to="/" className="link-offset-2 link-underline link-underline-opacity-0 fs-5 fw-medium"><i className="bi bi-arrow-left-short"></i> Back to Dashboard</Link>
                    <br/>
                    <br/>
                    <Link to="/LeadsByStatus" className="link-offset-2 link-underline link-underline-opacity-0 ms-4 fs-5 fw-medium">Leads by Status</Link>
                    <br/>
                    <br/>
                    <Link to="/LeadsBySalesAgent" className="link-offset-2 link-underline link-underline-opacity-0 ms-4 fs-5 fw-medium">Leads by Sales Agents</Link>
                </div>
            </div>
                <div className="col bg-light">
                    <DisplayComponentContext.Provider value={{
                        sortLeads,
                        setSortLeads,
                        sortBy,
                        setSortBy,
                        filter,
                        setFilter,
                        statusFilterOption,
                        setStatusFilterOption,
                        salesAgentFilterOption,
                        setSalesAgentFilterOption,
                        tagFilterOption,
                        setTagFilterOption
                    }}>
                        <div className="container">
                          {children}
                        </div>
                    </DisplayComponentContext.Provider>
                </div>
        </div>
       </div>
    )
}

const LeadListPage = () => {
    return (
        <DisplayComponents>
            <SalesAgentProvider>
                <LeadProvider>
                    <FilterElements/>
                    <DisplayLeads/>
                </LeadProvider>
            </SalesAgentProvider>
        </DisplayComponents>
    )
}

export default LeadListPage
export {DisplayComponents}
export { DisplayComponentContext }