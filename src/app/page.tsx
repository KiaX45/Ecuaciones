"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css'

const CoolingChart = dynamic(() => import('../components/CoolingChart'), { ssr: false });

// Definimos tipos para nuestras propiedades
interface ChartData {
  tiempos: number[];
  temperaturas: number[];
  T_segura: number;
  tiempoSeguro: number | undefined;
}

export default function Home(): JSX.Element {

  const [inputValues, setInputValues] = React.useState({
    T_inicial: 70,
    T_ambiente: 20,
    T_segura: 35,
    k: 0.1,
    T_comparacion: 50, //Temperatura de comparación
    t_comparacion: 5  //Tiempo de comparación
  });



  // Constantes
  const T_inicial: number = 70;  // Temperatura inicial del servidor en °C
  const T_ambiente: number = 20;  // Temperatura ambiente en °C
  const k: number = 0.1;  // Constante de enfriamiento en min^(-1)

  // Función para calcular la temperatura en un tiempo dado
  const temperatura = (t: number): number => {
    return inputValues.T_ambiente + (inputValues.T_inicial - inputValues.T_ambiente) * Math.exp(-inputValues.k * t);
  };

  // Generar datos para la gráfica
  const tiempoMaximo: number = 60;
  const tiempos: number[] = Array.from({ length: tiempoMaximo * 10 + 1 }, (_, i) => i / 10);
  React.useEffect(() => {

    calculateK();

    const tiempos: number[] = Array.from({ length: tiempoMaximo * 10 + 1 }, (_, i) => i / 10);
    const temperaturas: number[] = tiempos.map(t => temperatura(t));
    const tiempoSeguro: number | undefined = tiempos.find(t => temperatura(t) <= inputValues.T_segura);

    if (tiempoSeguro === undefined) {
      console.log("No se encontró un tiempo seguro en el rango especificado");
    }

    setChartData({
      tiempos,
      temperaturas,
      T_segura: inputValues.T_segura,
      tiempoSeguro
    });
  }, [inputValues]);


  const calculateK = () => {
    //Calculamos primeramente D en base a la temperatura inicial y la temperatura ambiente
    const D: number = inputValues.T_inicial - inputValues.T_ambiente; //recordamos que e ^(-kt) = 1 cuando t = 0
    //Calculamos k en base a la temperatura de comparación
    const K: number = Math.log((inputValues.T_comparacion - inputValues.T_ambiente) / D) * (-1 / inputValues.t_comparacion);
    if (K !== inputValues.k) {
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        k: K
      }));
    }
  }

  const [chartData, setChartData] = React.useState<ChartData>({
    tiempos: [],
    temperaturas: [],
    T_segura: inputValues.T_segura,
    tiempoSeguro: 0
  });


  const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: parseFloat(value)
    }));
  };

  return (
    <body className={styles.body}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTXT}>
            <h1>
              Ley de Newton de Enfriamiento - Servidor
            </h1>
          </div>
        </div>

      </header>


      <div className={styles.container}>

        <div className={styles.inputGroup}>
          <label htmlFor="T_inicial">Temperatura inicial (C°)</label>
          <input
            type="number"
            id="T_inicial"
            value={inputValues.T_inicial}
            onChange={handleSubmit}
            className={styles.inputField}
            placeholder='Temperatura inicial C°'
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="T_ambiente">Temperatura ambiente (C°)</label>
          <input
            type="number"
            id="T_ambiente"
            value={inputValues.T_ambiente}
            onChange={handleSubmit}
            className={styles.inputField}
            placeholder='Temperatura ambiente C°'
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="T_segura">Temperatura segura (C°)</label>
          <input
            type="number"
            id="T_segura"
            value={inputValues.T_segura}
            onChange={handleSubmit}
            className={styles.inputField}
            placeholder='Temperatura segura C°'
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="T_comparacion">Temperatura de comparación (C°)</label>
          <input
            type="number"
            id="T_comparacion"
            value={inputValues.T_comparacion}
            onChange={handleSubmit}
            className={styles.inputField}
            placeholder='Temperatura de comparación C°'
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="t_comparacion">tiempo de comparación (min)</label>
          <input
            type="number"
            id="t_comparacion"
            value={inputValues.t_comparacion}
            onChange={handleSubmit}
            className={styles.inputField}
            placeholder='tiempo de comparación (min)'
          />
        </div>

        <div className={styles.containerK}>
          <h2>Valor aproximado de k es: {inputValues.k.toFixed(5)}</h2>
        </div>
        <CoolingChart {...chartData} />

        <div className={styles.containerK}>
          {chartData.tiempoSeguro === undefined ? (
            <p>El servidor no alcanza la temperatura segura de {inputValues.T_segura}°C.</p>
          ) : (
            <p>El servidor alcanza la temperatura segura de {inputValues.T_segura}°C después de {chartData.tiempoSeguro.toFixed(2)} minutos.</p>
          )}
        </div>



      </div>
    </body>

  );
}