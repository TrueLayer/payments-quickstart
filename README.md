# Example Payments backend

## Local Setup

### Prerequisites

- node (see [here](https://nodejs.org/en/) for instructions)
- yarn (See [here](https://yarnpkg.com/) for instructions)

### Install dependencies

```bash
$ yarn
```

### Run
To run the server locally you need at least these 3 environment variables set.
```bash
$ export CLIENT_ID=""
$ export CLIENT_SECRET=""
$ export REDIRECT_URI=""
```

```bash
$ yarn start
```

## Endpoints

### [POST] `/payment` - Create Payment Initiation
```bash
$ curl --location --request POST 'http://localhost:3000/payment' \
--header 'Content-Type: application/json' \
--data-raw '{
  "provider_id": "ob-sandbox-natwest",
  "amount_in_minor": 1
}'
```

### [GET] `/payment/{paymentId}` - Get Payment status
```bash
$ curl  'http://localhost:3000/payment/fc60ea24-318b-42cd-83b6-74c09f5f263d'
```
