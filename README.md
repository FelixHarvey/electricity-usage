# Electricity Usage
A web based visualisation to give users an insight into how their electricity consumption compares to the rest of Australia.

## Contents
* [So What?](#so-what)
* [How to View](#view)
* [How to Use](#use)
* [Data Procurement Process](#procurement)
* [Key Terms](#terms)

## <a name="so-what"></a>So What?
What a great question. In fact my favourite. Why does this matter?

Energy and electricity production is the primary source of greenhouse gas emissions (33% of emissions) within Australia and therefore contributes heavily to the issue of climate change within Australia. Climate change has numerous flow on effects which directly impact the sustainability of this planet. Electricity is of paramount importance because it can be produced sustainability through renewable energy and therefore can have little to no ongoing emissions.

## <a name="view"></a>How to View
1. Download repo.
2. Run local server and view index.html or vis.html (if you simply open the HTML links without the server you'll run into a CORS error).

*Link coming soon.*

## <a name="use"></a>How to Use
The choropleth compares SA2 regions (a suburb or a few suburbs combined). 
Simply scroll on the map to zoom in and out of your area of choice. 
Hovering over a region will display the relevant details for that region.

![](https://media.giphy.com/media/uopL5WDnlE37muxFN3/giphy.gif)

Electricity usage can be filtered by using the percentiles slider.

![](https://media.giphy.com/media/idfUEy5YSIKdk3ALEJ/giphy.gif)

The metric can be changed from the control panel, the two options are median electricity usage and emissions.
Emissions is calculated by multiplying the electricity usage by a state's estimate for emissions intensity.

![](https://media.giphy.com/media/JwGzJAH6z3gvlHHIYV/giphy.gif)

The electricity generation area chart can be changed by using the controls or alternatively clicking on a region in an appropriate state.
Hover over the area chart to see the composition of electricity generation in that state at that particular time.
The legend can also be used to highlight individual generation sources for that state.

![](https://media.giphy.com/media/1AuXQfFDwWKGLXdjSJ/giphy.gif)

## <a name="challenges"></a>Data Procurement Process
### Data Source
In order to create a choropleth, data relating to Statistical Area Level 2’s across Australia was obtained from the Australian Bureau of Statistics ([link](https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/1270.0.55.001July%202016?OpenDocument)). A Statistical Area Level 2 (SA2) is defined by the ABS as typically one or more related suburbs. This data was provided in the ESRI Shapefile format. This data was provided in an ESRI Shapefile format. 

Furthermore, the median electricity data usage was obtained from the ABS ([link](https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/4670.02012?OpenDocument)), this was collected across 3 years (2010, 2011 & 2012). Only the most recent data was utilised within the visualisation. The original data provided included, mean electricity usage, the various quantiles and of course median usage. Unfortunately usage data was not provided for the Northern Territory and the Australian Capital Territory. Below is a data dictionary for the columns that were used from the raw source, a number of columns were removed, this process is described in detail in the following section.

| Column Name     | Type    | Description                                                                                     |
| --------------- | ------- | ----------------------------------------------------------------------------------------------- |
| State           | string  | Name of the state that the SA2 is a part of.                                                    |
| SA2 Name        | string  | The name of the SA2 region.                                                                     |
| Mean            | integer | The average household electricity usage. Measured in kWh.                                       |
| Lowest Quintile | integer | The median household electricity usage in the bottom 20% of consumers. Measured in kWh.         |
| Second Quintile | integer | The median household electricity usage in the second lowest 20% of consumers. Measured in kWh.  |
| Third Quintile  | integer | The median household electricity usage in the middle 20% of consumers. Measured in kWh.         |
| Fourth Quintile | integer | The median household electricity usage in the second highest 20% of consumers. Measured in kWh. |
| Fifth Quintile  | integer | The median household electricity usage in the  highest 20% of consumers. Measured in kWh.       |
| Median          | integer | The median household electricity usage. Measured in kWh.                                        |

The third dataset that was used within the visualisation was NEM generation data. This was sourced from the web application titled [OpenNEM](https://opennem.org.au/), as the NEM only connects South Australia, Tasmania, Victoria, New South Wales & Queensland, generation data could only be sourced from these states. Due to the varying electricity generation sources in each state, a combined data dictionary has been presented below.

| Column Name           | Type  | Description                                                                                                                                                                                     |
| --------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date                  | date  | The month that measurements occurred.                                                                                                                                                           |
| Solar (Rooftop)       | float | The amount of electricity generated by rooftop solar. Measured in GWh.                                                                                                                          |
| Solar (Utility)       | float | The amount of electricity generated by utility scale solar. Measured in GWh.                                                                                                                    |
| Wind                  | float | The amount of electricity generated by wind farms. Measured in GWh.                                                                                                                             |
| Hydro                 | float | The amount of electricity generated by hydro power plants. Measured in GWh.                                                                                                                     |
| Battery (Discharging) | float | The amount of electricity generated by batteries. Measured in GWh.                                                                                                                              |
| Gas (Reciprocating)   | float | The amount of electricity generated by gas in internal combustion engines (typically small plants). Measured in GWh.                                                                            |
| Gas (OCGT)            | float | The amount of electricity generated by gas in open cycle gas-turbine plants. Measured in GWh.                                                                                                   |
| Gas (CCGT)            | float | The amount of electricity generated by gas in combined cycle gas-turbine plants. Measured in GWh.                                                                                               |
| Gas (Steam)           | float | The amount of electricity generated by gas used to heat water, to create steam and turn a turbine. Measured in GWh.                                                                             |
| Distillate            | float | The amount of electricity generated by using oils such as petrol. Measured in GWh.                                                                                                              |
| Biomass               | float | The amount of electricity generated by burning biomass (plant or animal material). This is more efficient than brown coal. Measured in GWh.                                                     |
| Black Coal            | float | The amount of electricity generated by burning brown coal. This is more efficient than brown coal. Measured in GWh.                                                                             |
| Brown Coal            | float | The amount of electricity generated by burning brown coal. This is less efficient than black coal. Measured in GWh.                                                                             |
| Emissions Intensity   | float | The amount of carbon dioxide equivalent emissions per MWh of generation on average. This is based on the composition of the energy generation sources used for that month. Measured in kg CO2e. |

In summary data was sourced from the following sources:

-   [Australian Bureau of Statistics - 2011 SA2 Region Boundaries](https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/1270.0.55.001July%202016?OpenDocument)

-   [Australian Bureau of Statistics - Household Electricity Consumption Data](https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/4670.02012?OpenDocument)

-   [OpenNEM - Electricity Generation Data](https://opennem.org.au/)

During the planning stage, further possibly useful datasets were identified to expand the visualisation to an international scale, however, due to time constraints they were not used. They are nonetheless listed to demonstrate the research that occurred.

-   [International Energy Statistics - United Nations](https://www.kaggle.com/unitednations/international-energy-statistics)

-   [Australia's Emissions in Context - Commonwealth of Australia](https://soe.environment.gov.au/theme/climate/topic/2016/australias-emissions-context)

-   [Renewable Energy - Our World in Data](https://ourworldindata.org/renewable-energy)

-   [List of Countries by Renewable Energy Production - Wikipedia](https://en.wikipedia.org/wiki/List_of_countries_by_renewable_electricity_production)

-   [Country Rankings - International Renewable Energy Agency](https://www.irena.org/Statistics/View-Data-by-Topic/Capacity-and-Generation/Country-Rankings)

-   [Renewable Energy Consumption - World Bank](https://data.worldbank.org/indicator/eg.fec.rnew.zs)

Additionally, research was also conducted into further complicating the emissions calculation, but not enough time was dedicated to this process. Again, these resources are linked below.

-   [State Energy Consumption by Industry](http://energy.gov.au/publications/australian-energy-update-2019)

-   [Australian Greenhouse Emissions Information System](https://ageis.climatechange.gov.au/)

### Data Processing

Data was manipulated and transformed in various ways to ensure it is appropriate for usage within the data visualisation. 

Firstly, although it may seem trivial, obtaining the region data in an appropriate and usable fashion was a laborious process. Unlike previous practice with choropleth visualisations where the region data was provided in a working format, considerable effort and time was spent obtaining the right data and subsequently manipulating it for use.

As the chosen visualisation tool, D3, is unable to process ESRI Shapefile data, the SA2 region boundaries were imported into the geographic information system application QGIS. Within this application the data could be transformed into a more appropriate GeoJSON or TopoJSON file format. 

![](https://i.imgur.com/nzZ10bt.png)

Upon exporting the data from QGIS and attempting to use it within the application, the speed of the visualisation was noticeably slow and laggy. Although the final solution hasn’t eliminated this issue, rest assured it has improved upon it considerably. Therefore, a number of steps within QGIS were taken to reduce the file size and thus reduce the processing power required in the visualisation. Notably, the coordinate precision of each of the points was reduced from 15 down to 6. This saved a tremendous amount of data whilst still being accurate to within 10cm (highlighting the wasted accuracy at 15 decimal places). Additionally, erroneous fields present in the original Shapefile file were removed that further reduced the file size.

The data was then imported to the web based application ‘Mapshaper’ which was employed to compress the file. The images below show before and after the compression algorithm. It is clear to see detail that has been sacrificed, but to reduce the size of the file by 20x, it was a decision that needed to be made. Although the boundaries are less precise at the completion of the compression, they are still recognisable and are substituted by the much more valuable speed of loading.


![](https://imgur.com/KVU7z8V.png)

GeoJSON before compression

![](https://imgur.com/MHy3UGZ.png)

GeoJSON after compression


Finally, the data for the regions was converted to a TopoJSON file, this allowed for even smaller file size. TopoJSON differs from GeoJSON, by allowing geographical boundaries to be shared. This dramatically decreases the amount of storage required because almost every region will border at least one other region. This again was completed using Mapshaper.

Because NSW compared to the rest of the country provided slightly different figures (Net vs Gross). These figures have been compared directly which may result in some false comparisons, however in order for this to occur, multiple CSV files were concatenated. This was achieved by converting each individual file to have the same columns and then simply pasting across the data from one file to another.

Due to the ABS electricity consumption data being summed at both SA3, SA4 and state levels, this data had to be removed. Because the names of the aggregate regions (SA3 & SA4) were contained in separate columns, these columns were removed. This aggregation is shown in the image below

Once the aggregation columns were removed, the data rows still remained just with blank SA2 identifiers. Microsoft Excel was then used to remove the whole row if the SA2 name column contained a blank entry. 

![](https://imgur.com/uyEwhur)

To calculate rankings within the respective states and Australia, the Excel ‘RANK’ function was utilised, and when the file was converted to a CSV the numbers were retained. At this point the count of SA2 regions in each state individually as well as across Australia as a whole was recorded and later manually inputted into the JavaScript code. This saves unnecessary aggregation and calculation when the data is loaded from a user's browser. 

A similar process was applied to achieve an average emissions intensity for each state across the past year, with this information manually put into the graph to save aggregation during the load. To calculate an individual SA2 region’s emissions, the state average is multiplied by their respective usage.

The generation data provided by OpenNEM did not require much manipulation. Irrelevant columns were deleted and the data format was changed so that the timestamp was removed. This reduced complexity when importing dates into D3 but was not necessary. Once imported into D3, a specific attribute for each SA2 region was calculated for their emissions, this was calculated by multiplying the median electricity usage by the state average emissions intensity and dividing by 1,000 because the intensity was measured in kg CO2e / MWh whereas median electricity usage was measured in kWh.

Finally, the state generation data was uploaded to GitHub Gists so that the local copies did not need to exist. This makes it easier to transfer HTML files and makes the visualisation more robust to change.

## <a name="terms"></a>Key Terms

* An SA2 region is a geographical area defined by the ABS. It is typically a suburb or few suburbs combined to have a population of approximately 10,000 people.
* The NEM (National Electricity Market) is the integrated electricity grid that comprises the eastern states of Australia (TAS, VIC, SA, NSW & QLD). Electricity generation and emissions data is reported for these states.
* Solar (Rooftop) is solar energy sourced from household rooftops.
* Solar (Utility) is solar energy sourced from industrial scale solar farms.
* Wind is energy sourced from wind farms.
* Hydro is energy sourced from hydro (water) power plants.
* Battery (Discharging) is energy sourced from batteries that have stored energy.
* Gas (Reciprocating) is energy sourced from internal combustion engines.
* Gas (OCGT) is energy sourced from an open cycle gas-turbine.
* Gas (CCGT) is energy sourced from a combined cycle gas-turbine.
* Gas (Steam) is energy sourced from burning gas to heat water.
* Distillate is energy sourced from petrol and oil.
* Biomass is energy sourced from burning plant and animal material.
* Black Coal is energy sourced from burning black coal (more clean than brown coal).
* Brown Coal is energy sourced from burning brown coal (less clean than black coal).
