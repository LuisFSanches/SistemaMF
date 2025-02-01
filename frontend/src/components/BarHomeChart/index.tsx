import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from "react-chartjs-2";
import { Container } from "./style";
import { ReactNode } from "react";

ChartJS.register(...registerables);

type BarHomeChartProps = {
    title: string;
    labels: string[];
    values: number[];
	order: number
};

const medals: Record<number, ReactNode> = {
    0: "🥇",
    1: "🥈",
    2: "🥉"
};

export function BarHomeChart({ title, labels, values, order }: BarHomeChartProps) {
	const backgroundColor = order === 2 ?
	['#B0625C', '#D7B0AD', '#816967', '#A69694', '#E6E6E6']
	: ['#CCAC00', '#ACACAC', '#D87323', '#B0625C', '#D7B0AD', '#816967'];

    const structure = {
        labels,
        datasets: [{
            label: title,
            data: values,
            backgroundColor: backgroundColor,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#F9F9F9',
            hoverBackgroundColor: 'rgba(255, 206, 86, 0.6)'
        }]
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Nº de Vendas',
                    font: {
                        size: 18
                    }
                },
                ticks: {
                    font: {
                        size: 13
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 15
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                align: 'center',
                text: title,
                font: {
                    size: 25
                }
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItems: any) => {
                        const index = tooltipItems[0].dataIndex;
                        return `${medals[index] || ''} ${tooltipItems[0].label}`;
                    }
                }
            },
            annotation: {
                annotations: labels.map((label, index) => (
                    index < 3 ? {
                        type: 'label',
                        xValue: index,
                        yValue: values[index] + 2,
                        backgroundColor: 'transparent',
                        content: medals[index],
                        font: {
                            size: 20
                        }
                    } : null
                )).filter(Boolean)
            }
        }
    };

    return (
        <Container className={`${order === 2 ? 'second' : ''}`}>
            <Bar data={structure} options={options as any} />
        </Container>
    );
}
