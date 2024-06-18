// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    const metaDataArray = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const selectedMetadata = metaDataArray.filter(
      d => d.id === parseInt(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(selectedMetadata[0]).forEach(([key, value]) => {
      metadataPanel.append("h5").text(`${key}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const sampleDataArray = data.samples;

    // Filter the samples for the object with the desired sample number
    const selectedSample = sampleDataArray.filter(sampleData => sampleData.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    const otuIDs = selectedSample[0].otu_ids;
    const otuLabels = selectedSample[0].otu_labels;
    const sampleValues = selectedSample[0].sample_values;

    // Build a Bubble Chart
    const bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: 'Earth'
      }
    }];

    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 30 },
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' }
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Build a Bar Chart
    const barData = [{
      y: otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x: sampleValues.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    const barLayout = {
      title: 'Top 10 Bacterial Cultures Found',
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach((sampleName) => {
      dropdownMenu.append("option").text(sampleName).property("value", sampleName);
    });

    // Get the first sample from the list
    const initialSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(initialSample);
    buildCharts(initialSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
