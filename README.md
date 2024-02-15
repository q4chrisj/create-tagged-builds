# Create Tagged Builds - POC

## Example implementation

Add the following action to a studio repository, update the team_city_project
value to match the TeamCity project that builds this repo.

```
name: Create Tagged Builds
on:
  push:
    tags:
      - "*"
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
          team_city_project: "CreateTaggedBuildsExample"
          gh_access_token: ${{ secrets.GH_ACCESS_TOKEN}}
```
