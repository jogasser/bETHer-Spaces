import React, {ReactElement} from "react";
import {LineChart} from "react-native-chart-kit";
import {ChartProps, formatDate} from "../../props/ChartProps";

export default function PMChart({ measurements }: ChartProps): ReactElement {
  return (<LineChart
    data={{
      labels: measurements.map(v => formatDate(v.timestamp)),
      legend: ['PM 1', 'PM 2.5', 'PM 10'],
      datasets: [
        {
          data: measurements.map(v => v.pm1 ? v.pm1 : Math.random() * 10),
          color: () => '#F8766D',
        },
        {
          data: measurements.map(v => v.pm25 ? v.pm25 : Math.random() * 10),
          color: () => '#00BA38',
        },
        {
          data: measurements.map(v => v.pm10 ? v.pm10 : Math.random() * 10),
          color: () => '#619CFF',
        },
      ]
    }}
    width={400}
    height={400}
    yAxisSuffix=" ug/m3"
    fromZero={true}
    chartConfig={{
      backgroundGradientFrom: "#FFFFFF",
      backgroundGradientTo: "#FFFFFF",
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      propsForHorizontalLabels: {
        dx: 10
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