import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';

// Custom colors for pie chart segments
const COLORS = ['#2962ff', '#1e88e5', '#0d47a1', '#5c6bc0', '#3949ab', '#283593', '#1565c0', '#0277bd', '#01579b', '#039be5'];

const PieChartViz = ({ data, labelKey, valueKey, title }) => {
  // Format data for display
  const formatData = () => {
    if (!data || data.length === 0) return [];
    
    // Limit to 10 items for better visualization
    return data.slice(0, 10).map(item => ({
      name: formatLabel(item[labelKey]),
      value: parseFloat(item[valueKey]) || 0
    }));
  };
  
  // Format labels
  const formatLabel = (label) => {
    if (label === null || label === undefined) return 'Unknown';
    
    if (typeof label === 'string' && label.length > 20) {
      return label.substring(0, 20) + '...';
    }
    
    return label;
  };
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0 }}><strong>{payload[0].name}</strong></p>
          <p style={{ margin: 0 }}>{`${valueKey}: ${payload[0].value}`}</p>
        </div>
      );
    }
    
    return null;
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
        subheader={`Distribution of ${valueKey} by ${labelKey}`}
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
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PieChartViz; 