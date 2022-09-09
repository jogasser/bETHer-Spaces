import React, {ReactElement} from "react";
import {LineChart} from "react-native-chart-kit";
import {ChartProps, formatDate} from "../../props/ChartProps";

export default function NoiseChart({ measurements }: ChartProps): ReactElement {
  return (<LineChart
    data={{
      labels: measurements.map(v => formatDate(v.timestamp)),
      datasets: [
        {
          data: measurements.map(v => v.noise == 'high' ? 3 : v.noise == 'mid' ? 2 : 1),
          color: () => "#fb8c00"
        }
      ]
    }}
    width={400}
    height={400}
    yAxisSuffix=""
    formatYLabel={yValue =>
      Number(yValue) == 3 ? 'high' :
      Number(yValue) == 2 ? 'mid' :
      Number(yValue) == 1 ? 'low' : ''
    }
    chartConfig={{
      backgroundGradientFrom: "#FFFFFF",
      backgroundGradientTo: "#FFFFFF",
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    }}
    style={{
      borderRadius: 16,
    }}
  />)
}