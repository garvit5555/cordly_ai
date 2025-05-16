import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';

const BarChartViz = ({ data, xAxis, yAxis, title }) => {
  // Format data for display
  const formatData = () => {
    if (!data || data.length === 0) return [];
    
    // Limit to 10 items for better visualization
    return data.slice(0, 10).map(item => ({
      name: formatXAxisLabel(item[xAxis]),
      value: parseFloat(item[yAxis])
    }));
  };
  
  // Format x-axis labels
  const formatXAxisLabel = (label) => {
    if (label === null || label === undefined) return '-';
    
    if (typeof label === 'string' && label.length > 15) {
      return label.substring(0, 15) + '...';
    }
    
    return label;
  };
  
  const chartData = formatData();
  
  if (!chartData || chartData.length === 0) {
    return (
      <Card className="visualization-card">
        <CardHeader title={title} />
        <CardContent>
          <Typography variant="body1">No data available for chart</Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="visualization-card">
      <CardHeader 
        title={title} 
        subheader={`${yAxis} by ${xAxis}`}
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 1,
          '.MuiCardHeader-subheader': {
            color: 'rgba(255,255,255,0.7)'
          }
        }}
      />
      <CardContent>
        <Box className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fontSize: 12 }}
                height={80}
              />
              <YAxis />
              <Tooltip formatter={(value) => [value, yAxis]} />
              <Legend />
              <Bar 
                dataKey="value" 
                name={yAxis} 
                fill="#2962ff" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BarChartViz; 