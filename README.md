# Setting up Auth0

- create an API
- create an Application

# Dev mode

- npm start in frontend
- cloud in backend

# Prod

- npm run build in frontend
- cloud in backend

# Cloud Params

Create the following params for the cloud-chat service

AUTH0_DOMAIN: "Domain" from your Auth0 application settings
AUTH0_AUDIENCE: "Identifier" from your Auth0 API settings

# TODO

- comment code
- update readme (auth0 instructions mainly)
- github actions, deploy to prod
- small screen responsive layout

- frontend tests
- sort conversations by most recent activity
- display user avatar in conversation list
- keep track of and show users that are "online"
- edit your user profile
- multi-user conversations
- multi-line message input
- typing indicator
- show dates in conversation thread
- search conversation messages
- search user names
- play sound when a message arrives
- handle errors when fetching data/state
- emoji picker
- gify type image messages
- ability to recenter the map on your current location

# Issues found

- TS sub-packages not transformed by Jest
- conflicting update error when updating service
- CLI crash, exception in packaging worker when moving/renaming modules
