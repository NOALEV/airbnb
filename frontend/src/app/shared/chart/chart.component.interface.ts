import { Label, Color } from 'ng2-charts';

export interface HChartsSettings {

    chartType: ChartType;
    datasets: Chart.ChartDataSets[];
    labels: Label[];
    isShowLegend: boolean;
    colors?: Color[];
}

export enum ChartType {

    Bars = 'bar',
    Lines = 'line',
    Pie = 'pie',
    Doughnut = 'doughnut'
}

export interface ChartEvent {

    event: MouseEvent;
    active: {}[];
}