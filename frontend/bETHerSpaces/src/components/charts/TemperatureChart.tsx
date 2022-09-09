import React, {ReactElement} from "react";
import {LineChart} from "react-native-chart-kit";
import {ChartProps, formatDate} from "../../props/ChartProps";

export default function TemperatureChart({ measurements }: ChartProps): ReactElement {
  return (<LineChart
    data={{
      labels: measurements.map(v => formatDate(v.timestamp)),
      datasets: [
        {
          data: measurements.map(v => v.temperature),
          color: () => "#F8766D"
        }
      ]
    }}
    width={400}
    height={400}
    yAxisSuffix="°C"
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