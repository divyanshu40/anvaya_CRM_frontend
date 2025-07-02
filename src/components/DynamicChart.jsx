import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    Title
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DynamicChart = ({type, data, options}) => {
    const chartMap = {
        bar: Bar,
        pie: Pie
    }
    const ChartComponent = chartMap[type]

    return (
        <ChartComponent data={data} options={options}/>
    )
}

export default DynamicChart