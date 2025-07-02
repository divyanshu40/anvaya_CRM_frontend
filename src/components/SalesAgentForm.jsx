import { useState, useContext } from "react";
import { SalesAgentContext } from "../contexts/SalesAgentProvider";

const SalesAgentForm = () => {
    const { setSalesAgents, setDisplayAddNewAgentForm } = useContext(SalesAgentContext);
    const [newSalesAgentData, setNewSalesAgentData] = useState({ name: "", email: "" });

    const formSubmitHandler = async (event) => {
        event.preventDefault();
        let salesAgentAddingResponse = await fetch("https://anvaya-crm-backend-omega.vercel.app/salesAgent/new", {
            method: "POST",
            body: JSON.stringify(newSalesAgentData),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (! salesAgentAddingResponse.ok) {
            throw new Error("Faled to add new sales agent");
        }
        let response = await fetch("https://anvaya-crm-backend-omega.vercel.app/salesAgents");
        if (! response.ok) {
            throw new Error("Failed to fetch sales agents");
        }
        let responseData = await response.json();
        setSalesAgents(responseData);
        setDisplayAddNewAgentForm(false);
    }

    return (
        <div className="bg-light">
            <div className="container">
                <h4 className="display-5 py-4">Add New Sales Agent</h4>
                <form onSubmit={formSubmitHandler}>
                <div className="col-md-4">
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Enter sales agent's name"
                    onChange={(event) => setNewSalesAgentData((prevData) => ({...prevData, name: event.target.value }))}
                    />
                </div>
                <br/>
                <div className="col-md-4">
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Enter sales agent's email id"
                    onChange={(event) => setNewSalesAgentData((prevData) => ({...prevData, email: event.target.value }))}
                    />
                </div>
                <div className="d-flex py-4">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button className="btn btn-primary ms-4" onClick={(event) => {
                        event.preventDefault();
                        setDisplayAddNewAgentForm(false)
                    }}>Cancel</button>
                </div>
                </form>
            </div>
        </div>
    )
}
export default SalesAgentForm