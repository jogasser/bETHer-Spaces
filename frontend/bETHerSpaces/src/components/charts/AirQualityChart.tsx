import React, {ReactElement} from "react";
import {LineChart} from "react-native-chart-kit";
import {ChartProps, formatDate} from "../../props/ChartProps";

export default function AirQualityChart({ measurements }: ChartProps): ReactElement {
  return (<LineChart
    data={{
      labels: measurements.map(v => formatDate(v.timestamp)),
      legend: ['CO Level', 'NO2 Level', 'NH3 Level'],
      datasets: [
        {
          data: measurements.map(v => v.oxidised ? v.oxidised : Math.random() * 10),
          color: () => '#28b463',
        },
        {
          data: measurements.map(v => v.reduced ? v.reduced : Math.random() * 10),
          color: () => '#f39c12',
        },
        {
          data: measurements.map(v => v.nh3 ? v.nh3 : Math.random() * 10),
          color: () => '#af7ac5',
        },
      ]
    }}
    width={400}
    height={400}
    yAxisSuffix=" ppm"
    fromZero={true}
    chartConfig={{
      backgroundGradientFrom: "#FFFFFF",
      backgroundGradientTo: "#FFFFFF",
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      propsForHorizontalLabels: {
        dx: 5
      },
      style: {
        overflow: 'visible'
      }
    }}
    bezier
    style={{
      borderRadius: 16,
    }}
  />)
}