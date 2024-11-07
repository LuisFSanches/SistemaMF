import { Chart as ChartJS, registerables } from 'chart.js'
import { Bar } from "react-chartjs-2";
import { Container } from "./style";

ChartJS.register(...registerables)

export function BarHomeChart(){
  const labels = ['Janeiro','Fevereiro','Março','Abril',]
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: [50, 70, 130, 110],
      backgroundColor:[
        'var(--primary-color)'

      ],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  
  return(
      <Container>
        <Bar
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
                text:"Vendas Mensais",
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


