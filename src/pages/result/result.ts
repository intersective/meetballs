import {Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BaseChartDirective} from "ng2-charts";

/*
 Generated class for the Result page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-result',
    templateUrl: 'result.html'
})
export class ResultPage {
    private results = {
        p1: 0, n1: 0,
        p2: 0, n2: 0,
        p3: 0, n3: 0,
        p4: 0, n4: 0,
        p5: 0, n5: 0,
        p6:[
            {count: 0, label: "Toxic"},
            {count: 0, label: "Could be better"},
            {count: 0, label: "Neutral"},
            {count: 0, label: "Pretty good"},
            {count: 0, label: "We had fun"}
        ],
        total: 0
    };

    private doughnutChartLabels:string[] = ["We had fun", "Pretty good", "Neutral", "Could be better", "Toxic"];
    private doughnutColors: any[] = [{ backgroundColor: ["#52c752", "#afdb4f", "#fc874c", "#ff6a57", "#d6494e"] }];
    private doughnutChartData:number[] = [];
    private doughnutChartType:string = 'doughnut';
    private doughnutChartOptions: any = {};

    @ViewChild( BaseChartDirective ) chart: BaseChartDirective;

    constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        this.results = this.navParams.get('results');
        this.doughnutChartOptions = {
            cutoutPercentage: 75,
            legend:{
                position: 'bottom',
                labels: {
                    generateLabels: this.generateLabels
                }
            }
        };
        this.doughnutChartData = this.results.p6.map(function(item, index, array){
            return item.count;
        }).reverse();
    }

    ionViewWillEnter(){
        this.chart.ngOnChanges({});
    }

    generateLabels(chart){
        var configArray = [];
        let colorsArray = ["#52c752", "#afdb4f", "#fc874c", "#ff6a57", "#d6494e"];

        for(var i = 0; i < chart.data.labels.length; i++){
            var config =  {
                // Label that will be displayed
                text: chart.data.labels[i] + ': ' + chart.data.datasets[0].data[i],

                // Fill style of the legend box
                fillStyle: colorsArray[i],//chart.legend.ctx.fillStyle,

                // If true, this item represents a hidden dataset. Label will be rendered with a strike-through effect
                hidden: chart.data.datasets[0].data[i] == 0,

                // For box border. See https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D/lineCap
                lineCap: chart.legend.ctx.lineCap,

                // For box border. See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
                lineDash: chart.legend.ctx.lineDash,

                // For box border. See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineDashOffset
                lineDashOffset: chart.legend.ctx.lineDashOffset,

                // For box border. See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
                lineJoin: chart.legend.ctx.lineJoin,

                // Width of box border
                lineWidth: 0, //chart.legend.ctx.lineWidth,

                // Stroke style of the legend box
                strokeStyle: chart.legend.ctx.strokeStyle,

                // Point style of the legend box (only used if usePointStyle is true)
                pointStyle: ""
            }

            configArray.push(config);
        }

        return configArray;
    }
}
