import React, {ReactElement} from "react";
import {LineChart} from "react-native-chart-kit";
import {ChartProps, formatDate} from "../../props/ChartProps";

export default function HumidityChart({ measurements }: ChartProps): ReactElement {
  return (<LineChart
    data={{
      labels: measurements.map(v => formatDate(v.timestamp)),
      datasets: [
        {
          data: measurements.map(v => v.humidity),
          color: () => "#619CFF"
        }
      ]
    }}
    width={400}
    height={400}
    yAxisSuffix=" %"
    fromZero={true}
    chartConfig={{
      backgroundGradientFrom: "#FFFFFF",
      backgroundGradientTo: "#FFFFFF",
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    }}
    bezier
    style={{
      borderRadius: 16,
    }}
  />)
}