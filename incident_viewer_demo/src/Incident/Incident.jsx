import React, { PureComponent } from 'react';
import moment from 'moment';

export default class HelpTip extends PureComponent {
    /**
     * Initalize d3 parts to render the incident
     */
    setup() {
        // add in groups for data
        this.goodIncidentLine = this.g.append('g').classed('good-incident-line', true);
        this.badIncidentLine = this.g.append('g').classed('bad-incident-line', true);
        this.incidentArrowLine = this.g.append('g').classed('incident-arrow-line', true);
        this.incidentArrowTri = this.g.append('g').classed('incident-arrow-tri', true);
    }

    /**
     * Render hover boxes if a mouse is over a certain section of the Incident
     */
    renderHoverBoxes() {
        const { plotAreaHeight, data, closest, xScale , yScale, mouseY } = this.props;
        
        const goodDescription = data.goodPeriodInfo
        const badDescription = data.badPeriodInfo
        const incidentDescription = data.incidentInfo

        const highlightedDate = moment(closest);
        const goodYmax = yScale(data.goodPeriodMetric);
        const badYmax = yScale(data.badPeriodMetric);
        this.infoHoverBox.selectAll('*').remove();


        const goodWidth = xScale(data.goodPeriodEnd) - xScale(data.goodPeriodStart);
        const badWidth = xScale(data.badPeriodEnd) - xScale(data.badPeriodStart);
        const goodHeight = plotAreaHeight-goodYmax
        const badHeight = plotAreaHeight-badYmax
        const incidentHeight = Math.abs(badYmax - goodYmax)
        const rectFitsText = (goodWidth > 180) && (badWidth > 180); // NOTE: This also must be manually tuned. It hides hover text in the case 
                                          // that the area is too small for the text to fit.
        
        // Draw the hover state for the good period information
        if (highlightedDate.isBefore(data.goodPeriodEnd) && highlightedDate.isSameOrAfter(data.goodPeriodStart) && mouseY > goodYmax) {
          this.infoHoverBox.append('rect')
          .classed("good-incident-area", true)
          .attr('x', xScale(data.goodPeriodStart))
          .attr('y', goodYmax)
          .attr('width', goodWidth)
          .attr('height', plotAreaHeight-goodYmax);

          if (rectFitsText) {
            this.infoHoverBox.append('text')
            .classed('good-hover-text', true)
            .attr('x', xScale(data.goodPeriodStart) + goodWidth/2)
            .attr('y', goodYmax + goodHeight/2)
            .attr("alignment-baseline", "central")
            .attr("text-anchor", "middle")
            .text(goodDescription)
          }
        }

        // Draw the hover state for the bad period information
        if (highlightedDate.isSameOrBefore(data.badPeriodEnd) && highlightedDate.isSameOrAfter(data.badPeriodStart) && mouseY > badYmax) {
          this.infoHoverBox.append('rect')
          .classed("bad-incident-area", true)
          .attr('x', xScale(data.badPeriodStart))
          .attr('y', badYmax)
          .attr('width', badWidth)
          .attr('height', plotAreaHeight-badYmax)
          
          if (rectFitsText) {
            this.infoHoverBox.append('text')
            .classed('bad-hover-text', true)            
            .attr('y', badYmax + badHeight/2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .attr('x', xScale(data.badPeriodStart) + badWidth/2)
            .text(badDescription)
          }
        }

        // Draw the hover state for the incident information
        if (highlightedDate.isSameOrBefore(data.badPeriodEnd) && highlightedDate.isSameOrAfter(data.badPeriodStart) && mouseY < badYmax && mouseY > goodYmax) {
          this.infoHoverBox.append('rect')
          .classed("incident-area", true)
          .attr('x', xScale(data.badPeriodStart))
          .attr('y', goodYmax)
          .attr('width', badWidth)
          .attr('height', badYmax-goodYmax)

          if (rectFitsText) {
            this.infoHoverBox.append('text')
            .classed('incident-hover-text', true)            
            .attr('y', badYmax - incidentHeight/2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .attr('x', xScale(data.badPeriodStart) + badWidth/2)
            .text(incidentDescription)
          }
        }
    }

    /**
     * Render the incident "good" and "bad" periods reference lines on the chart.
     */
    updateIncident() {
        const { data, incidentLineGenerator } = this.props;

        this.goodIncidentLine.selectAll('*').remove();
        this.badIncidentLine.selectAll('*').remove();

        this.updateIncidentArrow();

        const goodIncidentSeriesArray = [{x: data.goodPeriodStart, y: data.goodPeriodMetric}, {x: data.goodPeriodEnd, y: data.goodPeriodMetric} ];
        const badIncidentSeriesArray = [{x: data.badPeriodStart, y: data.badPeriodMetric}, {x: data.badPeriodEnd, y: data.badPeriodMetric} ];

        // LINES
        this.goodIncidentLine.append('path')
        .classed('good-incident-line', true)
        .attr('d', incidentLineGenerator(goodIncidentSeriesArray))
        
        this.badIncidentLine.append('path')
        .classed('bad-incident-line', true)
        .attr('d', incidentLineGenerator(badIncidentSeriesArray))
    }

    /**
     * Draws the downwards pointing red arrow betewen the good and bad periods.
     * The arrow is drawn using a line and a triangle, positioned on the good and
     * bad period data that is passed in from props. 
     */
    updateIncidentArrow() {
        const { data, xScale, yScale } = this.props;

        this.incidentArrowLine.selectAll('*').remove();
        this.incidentArrowTri.selectAll('*').remove();

        const incidentArrowX = data.goodPeriodEnd;
        const triWidth = 20;
        const triHeight = 15;
        
        const incidentArrowLineArray = [{x: incidentArrowX, y: data.goodPeriodMetric}, {x: incidentArrowX, y: data.badPeriodMetric}];
        
        
        const incidentArrowTriArray = [
            {x: xScale(incidentArrowX), y: yScale(data.badPeriodMetric)}, 
            {x: xScale(incidentArrowX) + triWidth/2, y: yScale(data.badPeriodMetric) - triHeight}, 
            {x: xScale(incidentArrowX) - triWidth/2, y: yScale(data.badPeriodMetric) - triHeight}
        ];

        //TRIANGLE
        this.incidentArrowTri.append('polygon')
            .classed('incident-arrow-tri', true)
            .data([incidentArrowTriArray])
            .attr('points', function(d) { 
            return d.map(function(d) {
                return [d.x,d.y].join(",");
            }).join(" ");
            });

        //LINE
        this.incidentArrowLine.append('line')
            .classed('incident-arrow-line', true)
            .attr('x1', xScale(incidentArrowLineArray[0].x))
            .attr('x2', xScale(incidentArrowLineArray[1].x))
            .attr('y1', yScale(incidentArrowLineArray[0].y))
            .attr('y2', yScale(incidentArrowLineArray[1].y)-triHeight/2);
    }

    render() {
        return (
            <h1>Something is here</h1>

            // <div>
            //     <svg
            //         id={id} // TODO(amy): maybe index of list for ASN entry in incidentData
            //         className="incident"
            //         height={height} // TODO: maybe top to bottom?
            //         ref={node => { this.root = node; }}
            //         width={width} // TODO: maybe from start to end date
            //         />
            // </div>
        )
    }
}
