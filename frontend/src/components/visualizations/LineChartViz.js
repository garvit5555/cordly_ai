import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';

const LineChartViz = ({ data, xAxis, yAxis, title }) => {
  // Format data for display, ensuring proper date sorting
  const formatData = () => {
    if (!data || data.length === 0) return [];
    
    // Create a copy to avoid mutating the original data
    const formattedData = [...data].map(item => ({
      name: formatXAxisDate(item[xAxis]),
      value: parseFloat(item[yAxis]),
      originalDate: new Date(item[xAxis]) // Store original date for sorting
    }));
    
    // Sort by date if it's a date field
    if (isDateField(data[0][xAxis])) {
      formattedData.sort((a, b) => a.originalDate - b.originalDate);
    }
    
    return formattedData;
  };
  
  // Check if a value is likely a date field
  const isDateField = (value) => {
    if (!value) return false;
    
    if (typeof value === 'string') {
      // Check for common date formats
      return /^\d{4}-\d{2}-\d{2}/.test(value) || 
             /^\d{2}\/\d{2}\/\d{4}/.test(value);
    }
    
    return value instanceof Date;
  };
  
  // Format date values for display
  const formatXAxisDate = (value) => {
    if (!value) return '';
    
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      
      return date.toLocaleDateString();
    } catch (e) {
      return value;
    }
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
        subheader={`${yAxis} over time`}
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
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fontSize: 12 }}
                height={50}
              />
              <YAxis />
              <Tooltip formatter={(value) => [value, yAxis]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={yAxis} 
                stroke="#2962ff" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LineChartViz; 