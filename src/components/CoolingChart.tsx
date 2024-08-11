"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CoolingChartProps {
  tiempos: number[];
  temperaturas: number[];
  T_segura: number;
  tiempoSeguro: number|undefined;
}

const CoolingChart: React.FC<CoolingChartProps> = ({ tiempos, temperaturas, T_segura, tiempoSeguro }) => {
  const data = {
    labels: tiempos,
    datasets: [
      {
        label: 'Temperatura del servidor',
        data: temperaturas,
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Temperatura segura',
        data: tiempos.map(() => T_segura),
        borderColor: 'red',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Enfriamiento del servidor según la Ley de Newton',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tiempo (minutos)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperatura (°C)',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default CoolingChart;