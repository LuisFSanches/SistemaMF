import { Chart as ChartJS, registerables } from 'chart.js'
import { Bar } from "react-chartjs-2";
import { Container } from "./style";

type BarHomeChartProps = {
	title: string;
	data: any;
	labels: any;
	values: any
};

ChartJS.register(...registerables)

export function BarHomeChart({ title, data, labels, values }: BarHomeChartProps) {
	const structure = {
		labels: labels,
		datasets: [{
			label: 'My First Dataset',
			data: values,
			backgroundColor:[
				'#B0625C', '#D7B0AD', '#816967', '#A69694', '#E6E6E6'
			],
			fill: false,
			borderColor: 'rgb(75, 192, 192)',
			tension: 0.1
		}]
	};

	return(
		<Container>
		<Bar
			data={structure}
			options={{
			maintainAspectRatio:false,
			responsive:true,
			scales:{
				yAxes:{
				
				title:{
					display: true,
					text:'Nº de Vendas',
					font:{
					size:18
					}
				},
				ticks:{
					font: {
					size: 13
					}
				}
				},
				xAxes:{
				grid:{
					display: false
				},
				ticks:{
					font: {
					size: 15
					}
				}
				}
			},
			plugins:{
				legend:{
				display: false
				},
				title:{
				display: true,
				align:'center',
				text: title,
				font: {
					size: 25
				}
				}
			}, 
			}}  
		>
		</Bar>
		</Container>
	)
}


