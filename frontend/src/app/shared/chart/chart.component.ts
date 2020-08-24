import { Component, ElementRef, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { ChartType, ChartEvent } from './chart.component.interface';
import { SimpleChanges } from '@angular/core/core';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { ChartOptions } from 'Chart.js';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnInit, OnChanges {

    @Input()

    chartType: ChartType;

    @Input()

    datasets: Chart.ChartDataSets[];

    @Input()

    labels: Label[];

    @Input()

    isShowLegend: boolean;

    @Input()

    colors: Color[];

    @Input()

    options: ChartOptions;



    @Output()

    chartClick = new EventEmitter<ChartEvent>();

    @Output()

    chartHover = new EventEmitter<ChartEvent>();



    @ViewChild(BaseChartDirective, { static: true })

    chart: BaseChartDirective;
    chartsOptions: ChartOptions;


    public chartColors: Color[];



    private lineChartColors: Color[];

    private barChartColors: Color[];

    private pieChartColors: Color[];

    private baseColorsLine: number[][];

    constructor(elementRef: ElementRef) {
    }

    ngOnInit() {
        this.setDefaults();
        this.setColors();
        this.setGraphColors();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.chartType || changes.colors)) {
            this.setGraphColors();
        }
    }

    setDefaults() {
        if (this.isShowLegend === undefined) {
            this.isShowLegend = true;
        }

        this.options = {
            legend: { display: this.isShowLegend, labels: { fontColor: 'black' } }
        }
    }



    setColors() {

        this.baseColorsLine = [[242, 108, 79], [88, 88, 88], [245, 166, 35], [160, 195, 79], [67, 190, 220]];
        this.lineChartColors = [];
        this.barChartColors = [];

        for (const baseColor of this.baseColorsLine) {

            this.lineChartColors.push({
                backgroundColor: `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},0.2)`,
                borderColor: `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},1)`,
                pointBackgroundColor: `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]},1)`,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},0.8)`
            });

            this.barChartColors.push({
                backgroundColor: `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},0.8)`,
                pointHoverBorderColor: `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},1)`
            });

        }

        const pieColors: string[] = [];

        for (const baseColor of this.baseColorsLine) {
            pieColors.push(`rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},1)`);
        }

        this.pieChartColors = [{ backgroundColor: pieColors }];

    }

    setGraphColors() {

        if (this.colors) {
            this.chartColors = this.colors;
        } else {
            switch (this.chartType) {
                case ChartType.Bars:
                    this.chartColors = this.barChartColors;

                    break;

                case ChartType.Lines:
                    this.chartColors = this.lineChartColors;

                    break;

                case ChartType.Doughnut:
                case ChartType.Pie:
                    this.chartColors = this.pieChartColors;

                    break;
                default:
            }
        }
    }

    public onChartClicked(event: ChartEvent): void {
        this.chartClick.emit(event);
    }

    public onChartHovered(event: ChartEvent): void {
        this.chartHover.emit(event);
    }

}