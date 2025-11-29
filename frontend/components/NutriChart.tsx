'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card } from './ui/card'

interface NutriChartProps {
  protein: number
  carbs: number
  fat: number
}

const COLORS = {
  protein: '#3b82f6', // blue
  carbs: '#10b981', // green
  fat: '#8b5cf6', // purple
}

export function NutriChart({ protein, carbs, fat }: NutriChartProps) {
  const total = protein + carbs + fat

  if (total === 0) {
    return (
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-3">Macro Distribution</h2>
        <p className="text-sm text-gray-500 text-center py-8">
          Chưa có dữ liệu
        </p>
      </Card>
    )
  }

  const data = [
    { name: 'Protein', value: protein, color: COLORS.protein },
    { name: 'Carbs', value: carbs, color: COLORS.carbs },
    { name: 'Fat', value: fat, color: COLORS.fat },
  ]

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3">Macro Distribution</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Protein:</span>
          <span className="font-semibold">{protein.toFixed(1)}g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Carbs:</span>
          <span className="font-semibold">{carbs.toFixed(1)}g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Fat:</span>
          <span className="font-semibold">{fat.toFixed(1)}g</span>
        </div>
      </div>
    </Card>
  )
}

