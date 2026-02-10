"use client";

import { useEffect, useRef } from "react";
import { Chart, type ChartConfiguration } from "chart.js";
import "chart.js/auto";

type InsightsChartProps = {
  isDark: boolean;
};

export default function InsightsChart({ isDark }: InsightsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"line", number[], string> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const axisColor = isDark ? "#737373" : "#9CA3AF";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(17,24,39,0.08)";

    const config: ChartConfiguration<"line", number[], string> = {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Revenue Flow",
            data: [45, 52, 48, 70, 65, 88, 110],
            borderColor: "#2563EB",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            backgroundColor: (context) => {
              const { chart } = context;
              const { ctx, chartArea } = chart;
              if (!chartArea) {
                return "rgba(37, 99, 235, 0.08)";
              }

              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, "rgba(37, 99, 235, 0.14)");
              gradient.addColorStop(1, "rgba(37, 99, 235, 0)");
              return gradient;
            },
            pointRadius: 4,
            pointHoverRadius: 8,
            pointBackgroundColor: "#2563EB",
            pointBorderColor: "#2563EB",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: axisColor,
              font: {
                size: 10,
                weight: 600,
              },
            },
          },
          y: {
            grid: {
              color: gridColor,
            },
            ticks: {
              display: false,
            },
            border: {
              display: false,
            },
          },
        },
      },
    };

    chartRef.current = new Chart(canvas, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [isDark]);

  return (
    <div className="h-full w-full pb-10">
      <canvas ref={canvasRef} id="revenueChart" data-testid="insights-chart" />
    </div>
  );
}
