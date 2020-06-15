require(ggplot2)
data <- read.csv("https://gist.githubusercontent.com/FelixHarvey/4af7080ec37fbdcec7438ccd643d7575/raw/2f983f1d09b087d98b52089d4a2e952a0e43a7e5/electricity-usage.csv")

ggplot(data, aes(x=Median)) + geom_histogram()