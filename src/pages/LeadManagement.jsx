import { useState, useEffect, useContext, createContext } from "react"
import { useParams, Link } from "react-router-dom";
import LeadProvider from "../contexts/LeadProvider"
import { LeadContext } from "../contexts/LeadProvider"
import SalesAgentProvider from "../contexts/SalesAgentProvider";
import { SalesAgentContext } from "../contexts/SalesAgentProvider";

const LeadManagementContext = createContext();

const LeadDetails = () => {
    const { id } = useContext(LeadManagementContext);
    const { loading, setLoading, error, setError, displayUpdateLeadForm, setDisplayUpdateLeadForm, updatedLeadData, setUpdatedLeadData} = useContext(LeadContext);
    const [lead, setLead] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`https://anvaya-crm-backend-mu.vercel.app/lead/details/${id}`)
        .then((response) => {
            if (! response.ok) {
                let errorData = response.json();
                if (response.status === 404) {
                    throw new Error(errorData.message);
                } else if (response.status === 500) {
                    throw new Error(errorData.error.error.message);
                }
            }
            return response.json();
        })
        .then((responseData) => {
            setLead(responseData);
            setError(null);
        })
        .catch((error) => {
            setError(error);
        })
        .finally(() => {
            setLoading(false);
        })
    }, []);

    return (
    <div>
        {loading && <div className="spinner-border text-primary position-fixed top-50 start-50"></div>}
        {error && <p className="fs-5 fw-medium position-fixed top-50 start-50">{error}</p>}
        {(!loading && !error) && <><div className="card">
               <p className="fs-4 fw-medium p-2">{lead?.name}</p>
            </div>
            <div className="row py-2">
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <p className="fs-5 fw-medium">Lead Details</p>
                                <button className="btn btn-primary" onClick={() => {
                                    setUpdatedLeadData(lead);
                                    setDisplayUpdateLeadForm(true);
                                }}><i className="bi bi-pencil"></i> Edit Lead</button>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <span className="fw-medium" style={{ color: "grey"}}>Lead Name</span>
                                    <br/>
                                    <span className="fs-5 fw-medium">{lead?.name}</span>
                                    <br/>
                                    <br/>
                                    <span className="fw-medium" style={{ color: "grey"}}>Company</span>
                                    <br/>
                                    <span className="fs-5 fw-medium"><i className="bi bi-buildings"></i> {lead?.company}</span>
                                    <br/>
                                    <br/>
                                    <span className="fw-medium" style={{ color: "grey"}}>Sales Agent</span>
                                    <br/>
                                    <span className="fs-5 fw-medium"><i className="bi bi-person"></i> {lead?.salesAgent.name}</span>
                                    <br/>
                                    <br/>
                                    <span className="fw-medium" style={{ color: "grey"}}>Lead Source</span>
                                    <br/>
                                    <span className="fs-5 fw-medium">{lead?.source}</span>
                                </div>
                                <div className="col-md-4">
                                    <span className="fw-medium" style={{ color: "grey"}}>Lead Status</span>
                                    <br/>
                                    {lead?.status === "New" && <span className="badge rounded-pill text-bg-primary">{lead?.status}</span>}
                                    {lead?.status === "Contacted" && <span className="badge rounded-pill text-bg-warning">{lead?.status}</span>}
                                    {lead?.status === "Qualified" && <span className="badge rounded-pill text-bg-success">{lead?.status}</span>}
                                    {lead?.status === "Proposal Sent" && <span className="badge rounded-pill text-bg-secondary">{lead?.status}</span>}
                                    {lead?.status === "Closed" && <span className="badge rounded-pill text-bg-danger">{lead?.status}</span>}
                                    <br/>
                                    <br/>
                                    <span className="fw-medium" style={{ color: "grey"}}>Priority</span>
                                    <br/>
                                    {lead?.priority === "High" && <span className="fs-5 fw-medium"><i className="bi bi-fire" style={{ color: "orangered"}}></i> {lead?.priority}</span>}
                                    {lead?.priority === "Medium" && <span className="fs-5 fw-medium"><i className="bi bi-exclamation-circle" style={{ color: "yellow"}}></i> {lead?.priority}</span>}
                                    {lead?.priority === "Low" && <span className="fs-5 fw-medium"><i className="bi bi-caret-down-fill" style={{ color: "black"}}></i> {lead?.priority}</span>}
                                    <br/>
                                    <br/>
                                    <span className="fw-medium" style={{ color: "grey"}}>Time to Close</span>
                                    <br/>
                                    <span className="fs-5 fw-medium"><i className="bi bi-clock" style={{ color: "blue"}}></i> {lead?.timeToClose}</span>
                                    <br/>
                                    <br/>
                                    <span className="fw-medium" style={{ color: "grey"}}>Deal Value</span>
                                    <br/>
                                    <span className="fs-5 fw-medium"><i className="bi bi-currency-dollar"></i>{lead?.value}</span>
                                </div>
                            </div>
                            <hr/>
                            <div>
                                <span className="fw-medium" style={{ color: "grey"}}>Tags</span>
                                <br/>
                                {lead?.tags.map((tag) => {
                                    return (
                                        <span className="badge rounded-pill text-bg-primary ms-2 fs-6"><i className="bi bi-tag"></i>{tag}</span>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>}
    </div>
    )
}

const CommentsSection = () => {
    const { id } = useContext(LeadManagementContext);
    const [comments, setComments] = useState(null);
    const [newCommentData, setNewCommentData] = useState({ lead: id, author: "", commentText: ""});
    const {salesAgents} = useContext(SalesAgentContext);

    const addCommentHandler = async () => {
        try {
            let addCommentResponse = await fetch("https://anvaya-crm-backend-mu.vercel.app/comment/new", {
                method: "POST",
                body: JSON.stringify(newCommentData),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (! addCommentResponse.ok) {
                throw new Error("Failed to add comment");
            }
            let response = await fetch(`https://anvaya-crm-backend-mu.vercel.app/comments/lead/${id}`);
            if (! response.ok) {
                throw new Error("Failed to fetch comments");
            }
            let responseData = await response.json();
            setComments(responseData);
        } catch(error) {
            console.error('Error: ', error);
        }
    }

    useEffect(() => {
        fetch(`https://anvaya-crm-backend-mu.vercel.app/comments/lead/${id}`)
        .then((response) => {
            if (! response.ok) {
                throw new Error("Failed to fetch comments");
            }
            return response.json();
        })
        .then((responseData) => {
            setComments(responseData);
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
    }, []);
    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <p className="fs-4 fw-medium">Comments Section</p>
                    <p className="fs-5 fw-medium">{comments?.length} Comments</p>
                </div>
                <section className="p-5 bg-light">
                    <div className="py-2 col-md-4">
                        <label className="form-label fw-medium">Comment Author:</label>
                        <select className="form-select" onChange={(event) => setNewCommentData((prevData) => ({...prevData, author: event.target.value}))}>
                            <option value="">--Select Author--</option>
                            {salesAgents?.map((agent) => {
                                return (
                                    <option value={agent._id}>{agent.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <textarea 
                    className="form-control"
                    rows={5}
                    cols={50}
                    placeholder="Add a new comment about this lead"
                    onChange={(event) => setNewCommentData((prevData) => ({...prevData, commentText: event.target.value}))}
                    ></textarea>
                    {Object.values(newCommentData).includes("") ? <button className="btn btn-primary mt-4" disabled>Add Comment</button> : <button className="btn btn-primary mt-4" onClick={addCommentHandler}>Add Comment</button>}
                </section>
                <section className="py-2">
                    {comments?.map((comment) => {
                        let dateString = new Date(comment.createdAt);
                        const fullYear = dateString.getFullYear();
                        const month = String(dateString.getMonth() + 1).padStart(2, "0");
                        const day = String(dateString.getDate()).padStart(2, '0');
                        const hours = (dateString.getHours());
                        const formattedHours = String(hours > 12 ? hours - 12 : hours).padStart(2, '0');
                        const minutes = String(dateString.getMinutes()).padStart(2, '0');
                        const formattedDate = `${fullYear} - ${month} - ${day}`;
                        let formattedTime = "";
                        formattedTime = hours >= 12 ? `${formattedHours} - ${minutes} PM` : `${formattedHours} - ${minutes} AM`
                        return (
                            <div className="row py-2" key={comment._id}>
                                <div className="col">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex">
                                                <p className="fs-5 fw-medium">{comment.author.name}</p>
                                                <p className="ms-4" style={{ color: "grey"}}>{formattedDate} . {formattedTime}</p>
                                            </div>
                                            <p className="fs-5">{comment.commentText}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </section>
            </div>
        </div>
    )
}

const LeadManagementComponents = ({children}) => {
    const { id } = useParams();

    return (
    <div>
        <div className="row">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <p className="fs-3 fw-medium">Lead Management</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="row py-4">
            <div className="col-md-3">
                <Link to="/" className="link-offset-2 link-underline link-underline-opacity-0 ms-4 fs-5 fw-medium"><i className="bi bi-arrow-left-short"></i>Back to Dashboard</Link>
            </div>
            <div className="col bg-light py-4">
                <div className="container">
                    <LeadManagementContext.Provider value={{ id }}>
                        {children}
                    </LeadManagementContext.Provider>
                </div>
            </div>
        </div>
    </div>
    )
}

const LeadManagementPage = () => {
    return (
        <LeadManagementComponents>
            <SalesAgentProvider>
                <LeadProvider>
                    <LeadDetails/>
                    <CommentsSection/>
                </LeadProvider>
            </SalesAgentProvider>
        </LeadManagementComponents>
    )
}

export default LeadManagementPage