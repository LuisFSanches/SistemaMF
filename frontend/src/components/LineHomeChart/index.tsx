import { Chart as ChartJS, registerables } from 'chart.js'
import { Line } from "react-chartjs-2";
import { Container } from "./style";

ChartJS.register(...registerables)

export function LineHomeChart(){
  const labels = ['Segunda','Terça','Quarta','Quinta','Sexta',]
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: [5, 12, 25, 20, 30],
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
                text:"Vendas Diárias",
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


