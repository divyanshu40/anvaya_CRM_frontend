import { useState, useContext, useEffect, createContext } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import LeadProvider from './contexts/LeadProvider'
import { LeadContext } from './contexts/LeadProvider'
import SalesAgentProvider from './contexts/SalesAgentProvider'

const CategorizeLeads = () => {
  const { leads } = useContext(LeadContext);
  const [newLeads, setNewLeads] = useState(null);
  const [contactedLeads, setContactedLeads] = useState(null);
  const [qualifiedLeads, setQualifiedLeads] = useState(null);
  const [proposedLeads, setProposedLeads] = useState(null);
  const [closedLeads, setClosedLeads] = useState(null);

  useEffect(() => {
    setNewLeads(leads?.filter((lead) => lead.status === "New"));
    setContactedLeads(leads?.filter((lead) => lead.status === "Contacted"));
    setQualifiedLeads(leads?.filter((lead) => lead.status === "Qualified"));
    setProposedLeads(leads?.filter((lead) => lead.status === "Proposal Sent"));
    setClosedLeads(leads?.filter((lead) => lead.status === "Closed"));
  }, [leads]);
  return (
    <div className='mt-4 row container d-flex justify-content-center'>
      <div className='col-md-2'>
        <div className='card'>
          <div className='card-body'>
            <div className='d-flex'>
              <i className='bi bi-clock' style={{ color: "blue" , fontSize: "30px"}}></i>
              <div className='ms-4'>
                <p className='fs-5 fw-medium'>{newLeads?.length}</p>
                <p className='fw-medium'>New Leads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col-md-2'>
        <div className='card'>
          <div className='card-body'>
            <div className='d-flex'>
              <i className='bi bi-telephone' style={{ color: "orange" , fontSize: "30px"}}></i>
              <div className='ms-4'>
                <p className='fs-5 fw-medium'>{contactedLeads?.length}</p>
                <p className='fw-medium'>Contacted Leads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col-md-2'>
        <div className='card'>
          <div className='card-body'>
            <div className='d-flex'>
              <i className='bi bi-check2-circle' style={{ color: "green" , fontSize: "30px"}}></i>
              <div className='ms-4'>
                <p className='fs-5 fw-medium'>{qualifiedLeads?.length}</p>
                <p className='fw-medium'>Qualified Leads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className='col-md-2'>
        <div className='card'>
          <div className='card-body'>
            <div className='d-flex'>
              <i className='bi bi-envelope' style={{ color: "black" , fontSize: "30px"}}></i>
              <div className='ms-4'>
                <p className='fs-5 fw-medium'>{proposedLeads?.length}</p>
                <p className='fw-medium'>Proposed Leads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className='col-md-2'>
        <div className='card'>
          <div className='card-body'>
            <div className='d-flex'>
              <i className='bi bi-door-closed-fill' style={{ color: "red" , fontSize: "30px"}}></i>
              <div className='ms-4'>
                <p className='fs-5 fw-medium'>{closedLeads?.length}</p>
                <p className='fw-medium'>Closed Leads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 

const DisplayLeads = () => {
  const { leads, loading, displayAddNewLeadForm, setDisplayAddNewLeadForm} = useContext(LeadContext);
  const [filter, setFilter] = useState("All");
  const [filteredLeads, setFilteredLeads] = useState(null);
  const [seletedLeadId, setSelectedLeadId] = useState("");
  
  useEffect(() => {
    setFilteredLeads(leads);
  }, [leads])
  return (
    <div className='py-4 container'>
      <div className='d-flex justify-content-between'>
        <div>
          {filter === "All" ? <button className='btn btn-primary'>All</button> : <button className='btn btn-light' onClick={() => {
            setFilter("All");
            setFilteredLeads(leads);
          }}>All</button>}
          {filter === "New" ? <button className='btn btn-primary ms-4'>New</button> : <button className='btn btn-light' onClick={() => {
            setFilter("New");
            setFilteredLeads(leads?.filter((lead) => lead.status === "New"));
          }}>New</button>}
          {filter === "Contacted" ? <button className='btn btn-primary ms-4'>Contacted</button> : <button className='btn btn-light' onClick={() => {
            setFilter("Contacted");
            setFilteredLeads(leads?.filter((lead) => lead.status === "Contacted"));
          }}>Contacted</button>}
          {filter === "Qualified" ? <button className='btn btn-primary ms4'>Qualified</button> : <button className='btn btn-light' onClick={() => {
            setFilter("Qualified");
            setFilteredLeads(leads?.filter((lead) => lead.status === "Qualified"));
          }}>Qualified</button>}
          {filter === "Proposal Sent" ? <button className='btn btn-primary ms-4'>Proposal Sent</button> : <button className='btn btn-light' onClick={() => {
            setFilter("Proposal Sent");
            setFilteredLeads(leads?.filter((lead) => lead.status === "Proposal Sent"));
          }}>Proposal Sent</button>}
          {filter === "Closed" ? <button className='btn btn-primary ms-4'>Closed</button> : <button className='btn btn-light' onClick={() => {
            setFilter("Closed");
            setFilteredLeads(leads?.filter((lead) => lead.status === "Closed"));
          }}>Closed</button>}
        </div>
        <button className='btn btn-primary' onClick={() => setDisplayAddNewLeadForm(true)}>+ Add New Lead</button>
      </div>
      <div className='py-4'>
        {loading && <div className='position-fixed top-50 start-50 spinner-border text-primary'></div>}
        {leads && <ul className='list-group'>
              <li className='list-group-item fs-5 fw-medium'>Leads ({filteredLeads?.length})</li>
              <li className='list-group-item d-flex bg-light'>
                <div className='col'>
                  <p className='fs-5 fw-medium' style={{ color: "grey"}}>Name</p>
                </div>
                <div className='col'>
                  <p className='fs-5 fw-medium' style={{ color: "grey"}}>Company</p>
                </div>
                <div className='col'>
                 <p className='fs-5 fw-medium' style={{ color: "grey"}}>Status</p>
                </div>
                <div className='col'>
                  <p className='fs-5 fw-medium' style={{ color: "grey"}}>Value</p>
                </div>
                <div className='col'>
                  <p className='fs-5 fw-medium' style={{ color: "grey"}}>Contact</p>
                </div>
              </li>
              {filteredLeads?.map((obj) => {
                return (
                 <>
                  {(seletedLeadId === obj._id) ?  <Link to={`/lead/${obj._id}`} className='link-offset-2 link-underline link-underline-opacity-0' onMouseLeave={() => setSelectedLeadId("")}>
                   <li className='list-group-item d-flex' key={obj._id} style={{ backgroundColor: "grey"}}>
                    <div className='col'>
                      <p className='fs-5 fw-medium'>{obj.name}</p>
                    </div>
                    <div className='col'>
                     <p className='fs-5 fw-normal'>{obj.company}</p>
                    </div>
                    <div className='col'>
                      {obj.status === "New" && <span className='badge rounded-pill text-bg-primary'>{obj.status}</span>}
                      {obj.status === "Contacted" && <span className='badge rounded-pill text-bg-warning'>{obj.status}</span>}
                      {obj.status === "Closed" && <span className='badge rounded-pill text-bg-danger'>{obj.status}</span>}
                      {obj.status === "Qualified" && <span className='badge rounded-pill text-bg-success'>{obj.status}</span>}
                      {obj.status === "Proposal Sent" && <span className='badge rounded-pill text-bg-secondary'>{obj.status}</span>}
                    </div>
                    <div className='col'>
                      <p className='fs-5 fw-medium'><i className='bi bi-currency-dollar'></i>{obj.value}</p>
                    </div>
                    <div className='col'>
                      <p className='fs-5 fw-normal'>{obj.email}</p>
                    </div>
                  </li>
                  </Link> :  <Link to={`/lead/${obj._id}`} className='link-offset-2 link-underline link-underline-opacity-0' onMouseEnter={() => setSelectedLeadId(obj._id)}>
                   <li className='list-group-item d-flex' key={obj._id}>
                    <div className='col'>
                      <p className='fs-5 fw-medium'>{obj.name}</p>
                    </div>
                    <div className='col'>
                     <p className='fs-5 fw-normal' style={{ color: "grey"}}>{obj.company}</p>
                    </div>
                    <div className='col'>
                      {obj.status === "New" && <span className='badge rounded-pill text-bg-primary'>{obj.status}</span>}
                      {obj.status === "Contacted" && <span className='badge rounded-pill text-bg-warning'>{obj.status}</span>}
                      {obj.status === "Closed" && <span className='badge rounded-pill text-bg-danger'>{obj.status}</span>}
                      {obj.status === "Qualified" && <span className='badge rounded-pill text-bg-success'>{obj.status}</span>}
                      {obj.status === "Proposal Sent" && <span className='badge rounded-pill text-bg-secondary'>{obj.status}</span>}
                    </div>
                    <div className='col'>
                      <p className='fs-5 fw-medium'><i className='bi bi-currency-dollar'></i>{obj.value}</p>
                    </div>
                    <div className='col'>
                      <p className='fs-5 fw-normal' style={{ color: "grey"}}>{obj.email}</p>
                    </div>
                  </li>
                  </Link>}
                 </>
                )
              })}
            </ul>}
      </div>
    </div>
  )
}

const DisplayDashboard = ({children}) => {

  return (
     <div>
      <div className='row'>
        <div className='col'>
          <div className='card'>
            <div className='card-body'>
              <p className='fs-2 fw-medium'>Anvaya CRM Dashboard</p>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-2'>
          <Navbar/>
        </div>
        <div className='col bg-light'>
          {children}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <DisplayDashboard>
      <SalesAgentProvider>
        <LeadProvider>
          <CategorizeLeads/>
          <DisplayLeads/>
        </LeadProvider>
      </SalesAgentProvider>
    </DisplayDashboard>
  )
}

export default App
