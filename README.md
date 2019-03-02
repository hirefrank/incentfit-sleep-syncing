# Incentfit Sleep Syncing

This script records the user's sleep duration to [Incenfit](https://incentfit.com) on an ongoing basis. Currently, the script generates a random duration but could be extended to support an API call to a sleep tracking system or external source (e.g. spreadsheet). Inspired by [@dholdren's](https://github.com/dholdren) incentsleep. ;)

## Setup

1. Create a new [Google App Script](https://script.google.com/home/my) project with the contents of the `Code.gs` script.
1. Create `cookie` property and any other desired properties, see below. (File > Project properties > Script properties)
1. Run the setup function to configure the script to run daily. (Run > Run function > setup)
1. (Optional) Enable Stackdriver Logging. (View > Stackdriver Logging)

## Script Properties

Property name | Value
------------ | -------------
cookie | The user's webappincentfitcom incentfit.com cookie
hour_of_day (optional) | Triggers the script at `n` hour of day (12)

## Integration with Withings Sleep Sensor

In progress.
