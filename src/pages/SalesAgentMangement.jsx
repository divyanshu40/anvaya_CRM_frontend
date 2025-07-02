import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import SalesAgentProvider from "../contexts/SalesAgentProvider";
import { SalesAgentContext } from "../contexts/SalesAgentProvider";

const SalesAgents = () => {
    const { salesAgents, setDisplayAddNewAgentForm} = useContext(SalesAgentContext);

    return (
        <div className="card my-4">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <p className="fs-4 fw-medium">Sales Agents List</p>
                    <button className="btn btn-primary" onClick={() => setDisplayAddNewAgentForm(true)}>+ Add New Sales Agent</button>
                </div>
                <ul className="list-group col-md-6">
                    <li className="list-group-item d-flex justify-content-between bg-light">
                       <p className="fs-5 fw-medium" style={{ color: "grey"}}>Name</p>
                       <p className="fs-5 fw-medium" style={{ color: "grey"}}>Email</p>
                    </li>
                    {salesAgents?.map((agent) => {
                        return (
                            <li className="list-group-item d-flex justify-content-between" key={agent._id}>
                                <p className="fw-medium">{agent.name}</p>
                                <p className="fw-medium">{agent.email}</p>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

const SalesAgentManagementComponent = ({children}) => {

    return (
    <>
        <header>
            <div className="row">
               <div className="col">
                  <div className="card">
                        <div className="card-body">
                           <p className="fs-3 fw-medium">Sales Agent Management</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div className="row">
            <div className="col-md-3 mt-4">
                <Link to="/" className="link-offset-2 link-underline link-underline-opacity-0 ms-4 fs-5 fw-medium"><i className="bi bi-arrow-left-short"></i>Back to Dashboard</Link>
            </div>
            <div className="col bg-light">
                <div className="container">
                    {children}
                </div>
            </div>
        </div>
    </>
    )
}

const SalesAgentManagementPage = () => {
    return (
        <SalesAgentManagementComponent>
            <SalesAgentProvider>
                <SalesAgents/>
            </SalesAgentProvider>
        </SalesAgentManagementComponent>
    )
}

export default SalesAgentManagementPage