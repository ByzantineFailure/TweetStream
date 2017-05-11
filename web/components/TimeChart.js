import React from 'react';
import ReactDOM from 'react-dom';
import {Chart} from 'highcharts';

const INITIAL_BUCKET_MS = 1000,
    MAX_POINTS = 30;

function chartName(filter) {
    return `Posts by time bucket for filter ${filter}`;
}

function reAggregate(dataSet, bucketMs) {
    const result = [];
    
    //Aggregate data set by buckets 
    let startPoint = dataSet[0],
        currentCount = 0;
    dataSet.forEach(datum => {
        while(datum > (startPoint + bucketMs)) {
            result.push(currentCount);
            currentCount = 0;
            startPoint += bucketMs; 
        }
        currentCount++;
    });
    result.push(currentCount);

    //Slice to max length 
    if(result.length > MAX_POINTS) {
        return result.slice(result.length - MAX_POINTS);
    }
    return result;
}

class TimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.chart = null;
        this.startPoint = null;
        this.bucketMs = this.props.initialBucketMs;

        this.toAdd = [];
        this.dataSet = [];
        this.createChart = this.createChart.bind(this);
        this.aggregate = this.aggregate.bind(this);
        this.registerTweet = this.registerTweet.bind(this);
        this.aggregateInterval = null;
        this.updateBucketMs = this.updateBucketMs.bind(this);
    }
    aggregate() {
        if (!this.chart) {
            throw new Error('Chart does not exist when aggregate called!');
        }

        const shift = this.chart.series[0].data.length > MAX_POINTS,
            chartHasData = this.chart.series[0].data.length !== 0,
            totalEntries = !chartHasData ? 0 :
                 this.chart.series[0].data.reduce((acc, val) => acc + val.y, 0);

        this.chart.series[0].addPoint(this.toAdd.length, true, shift);
        this.dataSet = this.dataSet.slice(0, totalEntries); 

        this.toAdd = [];
    }
    registerTweet() {
        const time = new Date().getTime();
        this.dataSet.push(time);
        this.toAdd.push(time);
    } 
    updateBucketMs(bucketMs) {
        const seriesData = reAggregate(this.dataSet, bucketMs),
            startPoint = this.dataSet.slice(-1).pop() - (bucketMs * seriesData.length),
            newSeries = {
                pointStart: startPoint,
                pointInterval: bucketMs,
                data: seriesData
            };
        
        clearInterval(this.aggregateInterval);
        this.createChart(newSeries);
        this.aggregateInterval = setInterval(this.aggregate, bucketMs);
        this.bucketMs = bucketMs;
    }
    createChart(series) {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = new Chart('chart-target', {
            title: {
                text: chartName(this.props.filterName)
            },
            yAxis: {
                title: {
                    text: 'Tweets'
                },
                min: 0,
                allowDecimals: false
            },
            xAxis: {
                type: 'datetime'
            },
            legend: {
                enabled: false
            },
            series: [
                series
            ]
        }); 
    }
    componentDidMount() {
        this.createChart({
            pointStart: new Date().getTime(),
            pointInterval: this.props.initialBucketMs,
            data: []
        });
        this.aggregateInterval = setInterval(this.aggregate, this.props.initialBucketMs);
    }
    componentWillUnmount() {
        if(this.aggregateInterval) {
            clearInterval(this.aggregateInterval);
        }
        this.dataSet = [];
        this.toAdd = [];
    }
    componentWillReceiveProps(nextProps) {
        if (!this.chart) {
            return;
        }
        this.chart.setTitle({ text: chartName(nextProps.filterName) });
        if (this.props.filterName == nextProps.filterName) {
            return;
        }
        this.componentWillUnmount();
        this.componentDidMount();
    }
    render() {
        return <div id='chart-target' style={{ height: '400px', width: '100%'}}></div>
    }
}

TimeChart.propTypes = {
    filterName: React.PropTypes.string.isRequired,
    initialBucketMs: React.PropTypes.number.isRequired
}

export default TimeChart;

