# Incentfit Sleep Syncing

This script records the user's sleep duration to [Incenfit](https://incentfit.com) on an ongoing basis. Currently, the script generates a random duration but could be extended to support an API call to a sleep tracking system or external source (e.g. spreadsheet). Inspired by [@dholdren's](https://github.com/dholdren) incentsleep. ;)

## Getting Started

1. Create a new [Google App Script](https://script.google.com/home/my) project with the contents of `Code.gs`.
1. Create the `email` and `password` properties and any other desired properties, see below. (File > Project properties > Script properties)
1. Run the setup function to configure the script to run daily. (Run > Run function > setup)
1. (Optional) Enable Stackdriver Logging. (View > Stackdriver Logging)

## Script Properties

Property name | Value
------------ | -------------
email | **Required.** The user's email address used for authentication on incenfit.com
password | **Required.** The user's password used for authentication on incenfit.com
hour_of_day | Triggers the script at `n` hour of day (default: 12)

## Withings Sleep Sensor Support

In progress.
