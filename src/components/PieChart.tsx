import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80">
      <Pie 
        data={data} 
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 14
                }
              }
            }
          }
        }} 
      />
    </div>
  );
};

export default PieChart;