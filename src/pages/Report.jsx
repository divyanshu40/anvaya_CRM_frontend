import { Link } from "react-router-dom"
import DynamicChart from "../components/DynamicChart"
import LeadProvider from "../contexts/LeadProvider"
import { LeadContext } from "../contexts/LeadProvider"
import SalesAgentProvider from "../contexts/SalesAgentProvider"
import { SalesAgentContext } from "../contexts/SalesAgentProvider"
import { useContext, useEffect, useState } from "react"
import { plugins } from "chart.js"

const ReportOverview = () => {
    const { leads } = useContext(LeadContext);
    const [closedLeads, setClosedLeads] = useState(null);
    const [leadsInPipeline, setLeadsInPipeline] = useState(null);

    useEffect(() => {
        setClosedLeads(leads?.filter(lead => lead.status === "Closed"));
        setLeadsInPipeline(leads?.filter(lead => lead.status !== "Closed"));
    }, [leads]);

    return (
        <>
          <p className="fs-4 fw-medium py-4">Report Overview</p>
          <div className="row">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <p className="fs-5 fw-medium">{leads?.length}</p>
                        <p className="fs-5">Total Leads</p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <p className="fs-5 fw-medium">{closedLeads?.length}</p>
                        <p className="fs-5">Closed Leads</p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <p className="fs-5 fw-medium">{leadsInPipeline?.length}</p>
                        <p className="fs-5">Leads in Pipeline</p>
                    </div>
                </div>
            </div>
          </div>
        </>
    )
}

const LeadsClosedLastWeek = () => {
    const [lastWeekClosedLeads, setLastWeekClosedLeads] = useState(null);
    const [leadsInPipeline, setLeadsInPipeline] = useState(null);
    
    useEffect(() => {
       async function fetchData() {
         try {
            let closedLeadsResponse = await fetch("https://anvaya-crm-backend-omega.vercel.app/leads/closed/last-week");
            let leadsInPipelineResponse = await fetch("https://anvaya-crm-backend-omega.vercel.app/leads/pipeline");
            let closedLeadsData = await closedLeadsResponse.json();
            let leadsInPipelineData = await leadsInPipelineResponse.json();
            setLastWeekClosedLeads(closedLeadsData);
            setLeadsInPipeline(leadsInPipelineData);
        } catch(error) {
            console.error('Error: ', error);
        }
       }
       fetchData();
    }, []);

    const chartData = {
        labels: ["Leads Closed Last Week", "Leads in Pipeline"],
        datasets: [{
            label: "Leads",
            data: [lastWeekClosedLeads?.length, leadsInPipeline?.length],
            backgroundColor: ["red", "blue"]
        }]
    }
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            title: {
                display: true,
                position: "top",
                text: "Last Week Report",
                font: { size: 30}
            }
        }
    }
    return (
    <>
        <div className="row d-flex justify-content-center pb-2 pt-4">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <DynamicChart type="pie" data={chartData} options={chartOptions}/>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

const StatusWiseLeadsDistribution = () => {
    const { leads } = useContext(LeadContext);
    const [newLeads, setNewLeads] = useState(null);
    const [contactedLeads, setContactedLeads] = useState(null);
    const [qualifiedLeads, setQualifiedLeads] = useState(null);
    const [prorposalSentLeads, setProposalSentLeads] = useState(null);
    const [closedLeads, setClosedLeads] = useState(null);

    useEffect(() => {
        setNewLeads(leads?.filter(lead => lead.status === "New"));
        setContactedLeads(leads?.filter(lead => lead.status === "Contacted"));
        setQualifiedLeads(leads?.filter(lead => lead.status === "Qualified"));
        setProposalSentLeads(leads?.filter(lead => lead.status === "Proposal Sent"));
        setClosedLeads(leads?.filter(lead => lead.status === "Closed"));
    }, [leads]);

    const chartData = {
        labels: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
        datasets: [
            {
                label: "Leads",
                data: [newLeads?.length, contactedLeads?.length, qualifiedLeads?.length, prorposalSentLeads?.length, closedLeads?.length],
                backgroundColor: ["blue", "yellow", "green", "grey", "red"]
            }
        ]
    }
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            title: {
                display: true,
                position: 'top',
                text: "Status -Wise Leads Distribution",
                font: { size: 30 }
            }
        }
    }

    return (
        <div className="row py-4 d-flex justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <DynamicChart type="pie" data={chartData} options={chartOptions}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LeadsClosedBySalesAgents = () => {
    const { salesAgents } = useContext(SalesAgentContext);
    const { leads } = useContext(LeadContext);

    const chartData = {
        labels: salesAgents?.map(agent => agent.name),
        datasets: [
            {
                label: "Closed Leads",
                data: salesAgents?.map((agent) => {
                    let closedLeads = leads?.reduce((acc, curr) => (curr.status === "Closed" && curr.salesAgent._id === agent._id) ? acc + 1 : acc, 0);
                    return closedLeads;
                }),
                backgroundColor: "blue"
            }
        ]
    }
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        borderWidth: 1,
        plugins: {
            title: {
                display: true,
                position: 'top',
                text: "Leads Closed by Sales Agents",
                font: { size: 30 }
            }
        }
    }

    return (
        <div className="row d-flex justify-content-center pt-2 pb-5">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <DynamicChart type="bar" data={chartData} options={chartOptions}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ReportPageComponent = ({children}) => {
    return (
    <>
      <header>
        <div className="row">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <p className="fs-3 fw-medium">Anvaya CRM Reports</p>
                    </div>
                </div>
            </div>
        </div>
      </header>
      <div className="row">
        <div className="col-md-3 mt-5">
            <Link to="/" className="fs-5 fw-medium link-offset-2 link-underline link-underline-opacity-0 ms-4"><i className="bi bi-arrow-left-short"></i>Back to Dasboard</Link>
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



const ReportPage = () => {
    return (
        <ReportPageComponent>
            <SalesAgentProvider>
                <LeadProvider>
                    <ReportOverview/>
                    <LeadsClosedLastWeek/>
                    <StatusWiseLeadsDistribution/>
                    <LeadsClosedBySalesAgents/>
                </LeadProvider>
            </SalesAgentProvider>
        </ReportPageComponent>
    )
}

export default ReportPage