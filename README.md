# Create Tagged Builds - POC

## How to run this

1. Create a .env file in the root of the project and set the following:

- TC_URL: Path to the team city rest api
- TC_TOKEN: A token generated from your profile page in TeamCity

2. Run `npx ts-node src/index.ts`

- This will create a new build under Q4Web with the name v5.120.0. Since this
  is a POC all values are hard coded.

## Scope of this POC:

1. Will not address tagging the repository.
2. Will not take a project name string and tag string as input. These will be
   hard coded for the POC.
3. Will create a new tagged build under provided project name with the name of the tag.
4. Once the tagged build has been created successfully then trigger the build programtically.
5. Implemented using Q4Web in TeamCity (the most complicated repo setup we have)

## Future Implementation Idea's

- This code could be a github action that runs in each studio repository
  everytime a new tag is pushed.
