import { useState, useContext } from "react"
import { SalesAgentContext } from "../contexts/SalesAgentProvider"
import { LeadContext } from "../contexts/LeadProvider";

const AddLeadForm = () => {
    const { salesAgents } = useContext(SalesAgentContext);
    const { leads, setLeads, filteredLeads, setFilteredLeads, displayAddNewLeadForm, setDisplayAddNewLeadForm, loading, setLoading } = useContext(LeadContext);
    const [leadData, setLeadData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        source: "",
        salesAgent: "",
        status: "",
        tags: [],
        timeToClose: "",
        priority: "",
        value: "",
        closedAt: "",
        
    });
    const [displayTags, setDisplayTags] = useState(false);

    const tagsCheckBoxHandler = (event) => {
        if (event.target.checked) {
            setLeadData((prevData) => ({...prevData, tags: [...prevData.tags, event.target.value]}))
        } else {
            setLeadData((prevData) => ({...prevData, tags: prevData.tags.filter(ele => ele !== event.target.value)}));
        }
    }

    const formSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            let leadAddingResponse = await fetch("https://anvaya-crm-backend-omega.vercel.app/lead/new", {
                method: "POST",
                body: JSON.stringify(leadData),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (! leadAddingResponse.ok) {
                throw new Error("Failed to add new lead");
            }
            let response = await fetch("https://anvaya-crm-backend-omega.vercel.app/leads");
            if (! response.ok) {
                throw new Error("Failed to fetch leads");
            }
            let responseData = await response.json();
            setLeads(responseData);
            setFilteredLeads(responseData);
            setLoading(false);
            setDisplayAddNewLeadForm(false);
        } catch(error) {
            console.error('Error: ', error);
        }
    }

    return (
        <div className="bg-light py-4">
  <div className="container">
    <div className="row d-flex justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
    <h4 className="display-5 my-4">Add New Lead</h4>
    <form onSubmit={formSubmitHandler}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control col-md-4"
            placeholder="Enter name of the customer"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                name: event.target.value,
              }))
            }
          />
        </div>
        <br/>
        <div className="col-md-4 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter name of the company"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                company: event.target.value,
              }))
            }
          />
        </div>
        <br/>
        <div className="col-md-4 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your email"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                email: event.target.value,
              }))
            }
          />
        </div>
        <br/>
        <div className="col-md-4 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter contact number"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                phone: event.target.value,
              }))
            }
          />
        </div>
        <br/>
        <div className="col-md-4 mt-4">
          <select
            className="form-select"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                source: event.target.value,
              }))
            }
          >
            <option>--Select Lead Source--</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Email">Email</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <br/>
        <div className="col-md-4 mt-4">
          <select
            className="form-select"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                salesAgent: event.target.value,
              }))
            }
          >
            <option>--Select Sales Agent--</option>
            {salesAgents?.map((agent) => (
              <option value={agent._id} key={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mt-4">
          <select
            className="form-select"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                status: event.target.value,
              }))
            }
          >
            <option value="">--Select Lead Status--</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="col-md-12 mt-4">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={(event) => {
                if (event.target.checked) {
                    setDisplayTags(true);
                } else {
                    setDisplayTags(false);
                }
              }}
            />
            <label className="form-check-label fw-medium">Select Tags</label>
          </div>
        </div>

        {displayTags && (
          <div className="col-md-12 mt-3">
            <div className="row">
              {[
                "Retail", "Smart", "Consulting", "Enterprise", "Logistics",
                "Tech", "Software", "Digital", "Finance", "IOT", "Home",
                "Startup", "AI", "Education", "Data", "Analytics", "Cloud",
                "SAAS", "Marketing", "B2B", "Eco", "Green", "Health",
              ].map((tag) => (
                <div className="col-md-3 mb-2" key={tag}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value={tag}
                      onChange={tagsCheckBoxHandler}
                    />
                    <label className="form-check-label fw-medium">{tag}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="col-md-4 mt-4">
          <input
            type="number"
            className="form-control"
            placeholder="Enter time to close"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                timeToClose: event.target.value,
              }))
            }
          />
        </div>
        <div className="col-md-4 mt-4">
          <select
            className="form-select"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                priority: event.target.value,
              }))
            }
          >
            <option value="">--Select Priority--</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="col-md-4 mt-4">
          <input
            type="number"
            className="form-control"
            placeholder="Enter the value of Lead"
            onChange={(event) =>
              setLeadData((prevData) => ({
                ...prevData,
                value: event.target.value,
              }))
            }
          />
        </div>
        <div className="mt-4">
            <button className="btn btn-primary" onClick={(event) => {
              event.preventDefault();
             setDisplayAddNewLeadForm(false);
      }}>Cancel</button>
      <button type="submit" className="btn btn-primary ms-4">Save</button>
        </div>
    </form>
    </div>
    </div>
    </div>
    </div>
    </div>
</div>

    )
}

export default AddLeadForm