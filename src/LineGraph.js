import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import './Linegraph.css'

const options = {
    responsive: true,
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: true,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridlines: {
                    display: false,
                },
                ticks: {
                    callbacks: function (value, index, values) {
                        return numeral(value).format("+0,0");
                    },
                },
            },
        ]
    }
}

function LineGraph({ casesType }) {
    const [data, setData] = useState({})

    //https://disease.sh/v3..
    // covid-19/historical/all?lastdays=120
    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(res => res.json())
                .then(data => {
                    let chartData = buildChartData(data, casesType);
                    setData(chartData)
                });
        };
        fetchData();
    }, [casesType])

    function buildChartData(data, casesType) {
        const chartData = [];
        let lastDataPoint;

        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }

    return (
        <div className='linegraph'>
            <h3>Worldwide new {casesType}</h3>
            {data?.length > 0 && (
                <Line 
                    options={options}
                    data={{
                        datasets: [{
                            backgroundColor: 'rgba(204, 16, 52, 0.5)',
                            borderColor: '#CC1034',
                            data: data,
                        }]
                    }} />
            )}


        </div>
    )
}

export default LineGraph
