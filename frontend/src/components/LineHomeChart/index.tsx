import { Chart as ChartJS, registerables } from 'chart.js'
import { Line } from "react-chartjs-2";
import { Container } from "./style";

type LineHomeChartProps = {
	title: string;
	labels: any;
	values: any
};

ChartJS.register(...registerables)

export function LineHomeChart({ title, labels, values }: LineHomeChartProps){
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: values,
      fill: false,
      borderColor: '#9ABB7A',
      tension: 0.1,
    }]
  };
  
  return(
      <Container>
        <Line
          data={data}
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
                  display: true
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
              },
            
            },
          }}
          
        >
        </Line>
      </Container>
  )
        
      
}


