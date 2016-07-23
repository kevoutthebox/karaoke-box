
function D3MusicFrequency() {
  this.mainSvg = null;
  this.mainSvgHeight = 300;
  this.mainSvgWidth = 1200;
  this.barPadding = '1';
  this.analyser = null; // analyser node that writes frequencyData
  this.frequencyData = null; // sync frequencyData 8bit or 32bit array to D3Music

  this.createMainSvg = function(parent) {
    this.mainSvg = d3.select(parent).append('svg').attr('height', this.mainSvgHeight).attr('width', this.mainSvgWidth);
  };

  this.bind = function(analyser,frequencyData) {
    this.analyser = analyser;
    this.frequencyData = frequencyData;
  };

  this.createFrequencies = function() {
    this.mainSvg
      .selectAll('rect')
      .data(this.frequencyData)
      .enter()
      .append('rect')
      .attr('x',(d, i) => {
        return i * (this.mainSvgWidth / this.frequencyData.length);
      })
      .attr('width', this.mainSvgWidth / this.frequencyData.length - this.barPadding);
  };

  this.renderFrequencies = function() {
    // requestAnimationFrame(this.renderFrequencies);
    this.analyser.getByteFrequencyData(this.frequencyData); // now frequencyData array has data

    this.mainSvg.selectAll('rect')
      .data(this.frequencyData)
      .attr('y', (d) => {
        return this.mainSvgHeight - d;
      })
      .attr('height', (d) => {
        return d;
      })
      .attr('fill', (d) => {
        return 'rgb(' + d +  ',' + 30 + ',' + 200 + ')';
      });
  };

  this.remove = function() {
    this.mainSvg.remove(); // this might not work! it hasnt bee tested!
  };
}
