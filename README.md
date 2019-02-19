# Posts

React Native sample app with Node.js backend running on Docker.

### To run the unit tests:
`docker-compose -f docker-compose-test-unit.yml up`

### To run the integration tests:
`docker-compose -f docker-compose-test-integration.yml up`

### To start the backend:
`docker-compose -f docker-compose-start.yml up`

### To start the app in the Android emulator:
`cd app && npm install && npm install -g react-native-cli && react-native run-android`
