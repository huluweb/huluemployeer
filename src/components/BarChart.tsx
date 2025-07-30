import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  title?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title = '' }) => {
  return (
    <div className="w-full h-80">
      <Bar 
        data={data} 
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: !!title,
              text: title,
              font: {
                size: 16
              }
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }} 
      />
    </div>
  );
};

export default BarChart;