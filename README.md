<p align="center">
<img height="100px" src="./truelayer_logo.svg" />
</p>

<br>
<br>

# Example Payments backend

<br>
<br>

A sample backend server providing a thin abstraction over the [TrueLayer payments-api](https://truelayer.com/payments-api).
<br>
Used as a back-end with our [android](https://github.com/TrueLayer/android-sample/) and [iOS](https://github.com/TrueLayer/truelayer-ios-demo) samples.
<br>
<br>
Intended for example purposes only, to give an idea of the integration flow for TrueLayers Payments-Api V2.
<br>
For more information about Payments API integration you can browse our [documentation](https://docs.truelayer.com/#payments-api-v2).
<br>

## Local Setup

<br>

### Prerequisites

- node (see [here](https://nodejs.org/en/) for instructions)
- yarn (See [here](https://yarnpkg.com/) for instructions)

<br>

### Install dependencies

```bash
$ yarn
```

<br>

### Run
`export` or create a `.env` file within the root of the project and set the variables below.

```bash
TRUELAYER_CLIENT_ID="YOUR_CLIENT_ID" 
TRUELAYER_CLIENT_SECRET="YOUR_CLIENT_SECRET"
REDIRECT_URI="YOUR_DEPLOYED_SAMPLE_BACKEND_URI"
```

```bash
$ yarn start
```


<br>

## Endpoints

### [POST] `/payment` - Create Payment Initiation
```bash
$ curl --location --request POST 'http://localhost:3000/payment' \
--header 'Content-Type: application/json' \
--data-raw '{
  "provider_id": "ob-sandbox-natwest",
  "amount_in_minor": 1,
  "reference": "Test Payment"
}'
```

### [GET] `/payment/{paymentId}` - Get Payment status
```bash
$ curl  'http://localhost:3000/payment/fc60ea24-318b-42cd-83b6-74c09f5f263d'
```
