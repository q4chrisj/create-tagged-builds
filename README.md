# Create Tagged Builds

## Overview

This action is intended to reduce the amount of time it takes for a Studio
release manager to get a Studio repository ready for release by automating the
creation of tagged builds.

With this action impmented in a Studio repository, everytime a tag matching the
pattern `"v*.*.*"` is pushed the following will take place:

1. This action will look at the `team_city_project` parameter and find that
   project in TeamCity. It will then list all the subprojects (tagged builds)
   and find the most recent one.
2. The most recent tagged build will be copied to create a new project that
   matches the name of the tag that was pushed.
3. This action will look at the dependant tags for the newly created project and
   get the latest tag name for each and will set the corresponding parameter to
   this value.
4. Once all parameters and env.version have been updated the newly created
   project's CI build will be triggered.

## Example implementation

Add the following action to a studio repository, update the team_city_project
value to match the TeamCity project that builds this repo.

```
name: Create Tagged Builds
on:
  push:
    tags:
      - "v*.*.*"
jobs:
  create-tagged-build:
    runs-on: ubuntu-latest
    steps:
      - name: Create Builds for Release
        id: create-tagged-builds
        uses: q4chrisj/create-tagged-builds@main (don't forget to update this)
        with:
          team_city_uri: ${{ secrets.TEAM_CITY_URI }}
          team_city_token: ${{ secrets.TEAM_CITY_TOKEN }}
          team_city_project: "<TeamCityProjectName>"
          gh_access_token: ${{ secrets.GH_ACCESS_TOKEN}}
```
