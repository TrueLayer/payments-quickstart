<p align="center">
<img height="100px" src="./truelayer_logo.svg" />
</p>

# Payments Quickstart

**Warning:** This backend is not intended to be used in production. It is some sample code provided by TrueLayer to test the Android and iOS SDK and the Hosted Payment Page.

When integrating your payment system with the TrueLayer SDKs, there are some setup operations that your organization need to perform to achieve maximum security and to carry out a complete payment.
In particular, TrueLayer SDK does not requires secrets or token. Instead, they rely on your organization backend to create a payment and to pass the payment id and the resource token to the SDK.

This backend provides an example on how to create such services. It provides a thin abstraction over the [TrueLayer payments-api](https://truelayer.com/payments-api) that allow you to quickly create a payment and to query the status of that payment.
The payment created with this backend can be used to extract the information required by our [android](https://github.com/TrueLayer/android-sample/) and [iOS](https://github.com/TrueLayer/truelayer-ios-sdk) samples.

For more information about Payments API integration you can browse our [documentation](https://docs.truelayer.com/#payments-api-v2).

## Local Setup

Follow this instruction to set up the payments-quickstart locally.

### Prerequisites
In order to install and run the backend, the following programs are required:

- node (see [here](https://nodejs.org/en/) for instructions)
- yarn (See [here](https://yarnpkg.com/) for instructions)

### Install dependencies

To install the required dependencies, run the following command:

```bash
$ yarn
```

### Run
In order to properly run the backend, you need to provide some configurations. Please, `export` or create a `.env` (can be copied from `.env.example`) file within the root of the project and set the variables below based on your setup.

Private Key Format:

```bash 
"-----BEGIN EC PRIVATE KEY-----\nMIHcAgEBBEIBgW93aGZ0/KlD3DT/1G0/McMo92WdsJUB/nNb5/ZPlXEw+0R0uAUg\nzJcZ6qgAP5AFoXA3E1Z9zfxPehUfjeNpTWegBwYFK4EEACOhgYkDgYYABAFf+jXs\nT2VL2mM6OmpNKq98E1mQm3ugXL88iSw8yppDeOQWav9L+QDgmX6+1RK22lImln+v\nuj3hSNwSfAVxODGtCgBlASM+4n2hmduNcgiP0gm2k/6f1mwIrtVxnvuuGKm/DGoa\npjUMXCyZT/g2bR7vldQHoNN2qFJB8LTlqq2833t3tg==\n-----END EC PRIVATE KEY-----"
```

NOTE:
Now you can optionally use BASE64_PRIVATE_KEY instead of PRIVATE_KEY to prevent issues if the format. To do so you can simply use the command bellow:

```bash 
  base64 your-private-key.pem | pbcopy
```


Then, you can run the following command:

```bash
$ yarn start
```

There are some more parameters that can be customised. The following list contains all the available settings:

```bash
  SORT_CODE='123456' # a default sort code
  ACCOUNT_NUMBER='12345678' # a default account number
  BENEFICIARY_NAME='beneficiary' # a default beneficiary
  TRUELAYER_CLIENT_ID="YOUR_CLIENT_ID" 
  TRUELAYER_CLIENT_SECRET="YOUR_CLIENT_SECRET"
  HTTP_CLIENT_TIMEOUT=10000 # a default http timeout
  AUTH_URI='https://auth.truelayer-sandbox.com' # the auth uri to retrieve the auth token
  PAYMENTS_V3_URI='https://api.truelayer-sandbox.com' # the endpoint for the payments API
  PORT=3000 # the port that must be used by the server to run
```

It is possible also to preselect a specific kind of provider setting a provider_id in the environment

```bash
  # this is just an example 
  # please remeber to change also the `scheme_id` in case 
  PROVIDER_ID_PRESELECTED="mock-payments-de-embedded" 
```

## Endpoints

### [POST] `/v3/payment` - Create Payment
To create a payment, you can try and run this command.

```bash

$ curl -X POST 'http://localhost:3000/v3/payment' 
```

### [POST] `/v3/payment/euro` - Create Payment with Euro
To create a payment, you can try and run this command.

```bash

$ curl -X POST 'http://localhost:3000/v3/payment/euro' 
```

### [POST] `/v3/payment/provider` - Create Payment with Provider
To create a payment, you can try and run this command.

```bash

$ curl -X POST 'http://localhost:3000/v3/payment/provider' 
```


### [GET] `/v3/payment/{paymentId}` - Get Payment status
Once the payment has been created, you can retrieve its status by using this command.

```bash
$ curl -H 'Authorization: Bearer {resource_token}' 'http://localhost:3000/v3/payment/{payment_id}'
```

### [POST] `/v3/mandate` - Create a Mandate
To create a mandate, you can try and run this command.

```bash

$ curl -X POST 'http://localhost:3000/v3/mandate' 
```

### [GET] `/v3/mandate/{mandateId}` - Get Mandate status
Once the mandate has been created, you can retrieve its status by using this command.

```bash
$ curl -H 'Authorization: Bearer {resource_token}' 'http://localhost:3000/v3/mandate/{mandate_id}'
```