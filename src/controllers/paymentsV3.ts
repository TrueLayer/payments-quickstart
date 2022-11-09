import { NextFunction, Request, Response } from 'express';

import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/paymentv3-client';
import { HttpException } from 'middleware/errors';
import config from 'config';
import { AccountIdentifierType, CreatePaymentRequest, ProviderFilter } from 'models/v3/payments-api/create_payment';

/**
 * Controller for the PaymentsV3 API.
 * It responds to two endpoints, one to create a payment and one to retrieve the status of a payment.
 */
export default class PaymentsV3Controller {
  private paymentClient = new PaymentsClient(new AuthenticationClient());
  private basePayment = {
    amount_in_minor: 1,
    user: {
      name: 'John Doe',
      phone: '+447514983456',
      email: 'johndoe@gmail.com'
    }
  };

  /**
   * It creates a new payment.
   *
   * Method: POST
   * Path: /v3/payment
   * Header: Authorization: Bearer {auth_token}
   * Body:
   * ```json
   * {
   *   'amount_in_minor': 1234, // number
   *   'currency': 'GBP', // string
   *   'payment_method': {
   *     'type': 'bank_transfer', // string
   *     'statement_reference': 'a reference' // string
   *   },
   *   'beneficiary': {
   *    'type': 'external_account', // string
   *    'name': 'a name', // string
   *    'reference': 'a reference', // string
   *    'scheme_identifier': {
   *      'type': 'sort_code_account_number', // string
   *      'sort_code': '012345', // string, 6 numeric chars
   *      'account_number': '01234567', // string, 8 numeric chars
   *    }
   *   }
   * }
   * ```
   * Response: a payment, following the [response specification](https://docs.truelayer.com/reference/create-payment)
   * ```json
   * {
   *   'id': 'an id', // string
   *   'amount_in_minor': 1234, // number
   *   'currency': 'GBP', //string
   *   'payment_method': {
   *     'type': 'bank_transfer', // string
   *     'statement_reference': 'a reference' // string
   *   },
   *   'beneficiary': {
   *    'type': 'external_account', // string
   *    'name': 'a name', // string
   *    'reference': 'a reference', // string
   *    'scheme_identifier': {
   *      'type': 'sort_code_account_number', // string
   *      'sort_code': '012345', // string, 6 numeric chars
   *      'account_number': '01234567', // string, 8 numeric chars
   *    }
   *   },
   *   'status': 'authorization_required', // string
   *   'resource_token': 'a resource token', // string
   * }
   * ```
   */
  private makePayment = (currency?: 'EUR') => {
    const request = this.buildPaymentRequest(currency);
    return this.doPayment(request);
  };

  private doPayment = (request: CreatePaymentRequest) => async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // Ideally we should use DTOs / Domain Types but givent that the API spec is still work in progress, we keep the type transparent
      const response = await this.paymentClient.initiatePayment(request);

      res.status(200).send({
        localhost: `http://localhost:3000/payments#payment_id=${response.id}&resource_token=${response.resource_token}&return_uri=${config.REDIRECT_URI}`,
        hpp_url: `https://payment.truelayer-sandbox.com/payments#payment_id=${response.id}&resource_token=${response.resource_token}&return_uri=${config.REDIRECT_URI}`,
        ...response
      });
    } catch (error) {
      console.log('Failed to initiate payment.', error);
      next(error instanceof HttpException ? error : new HttpException(500, 'Failed to initiate payment.'));
    }
  };

  createPayment = this.makePayment();

  createEuroPayment = this.makePayment('EUR');

  /**
   * It creates a new payment with a provider preselected.
   *
   * Method: POST
   * Path: /v3/payment/provider
   * Header: Authorization: Bearer {auth_token}
   * Body: buildPaymentRequestWithProvider()
   *
   * */
  createPaymentWithProvider = () => {
    const request = this.buildPaymentRequestWithProvider();
    return this.doPayment(request);
  };

  /**
   * It returns the status of a payment, given its id.
   *
   * Method: GET
   * Path: /v3/payment/{payment_id}
   * Header: Authorization: Bearer {payment_resource_token}
   * Response: A payment status object, following [the specification](https://docs.truelayer.com/reference/get-payment-1)
   */
  getPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new HttpException(400, 'Bad URL: the URL is missing the paymentId parameter in the URL path.');
      }

      const response = await this.paymentClient.getStatus(id);
      res.status(200).send(response);
    } catch (error) {
      console.log('Failed to get payment.', error);
      next(error instanceof HttpException ? error : new HttpException(500, 'Failed to retrieve the payment.'));
    }
  };

  private buildPaymentRequest(currency?: 'EUR'): CreatePaymentRequest {
    // Include all providers by default,
    // this is particulary useful when testing on Mobile to test against embedded flow mock banks (xs2a-volksbanken-de-sandbox)
    const filter: ProviderFilter = {
      release_channel: 'alpha',
      countries: null,
      customer_segments: null,
      provider_ids: null,
      excludes: null
    };

    return currency
      ? {
          ...this.basePayment,
          currency,
          payment_method: {
            type: 'bank_transfer',
            provider_selection: config.PROVIDER_ID_PRESELECTED
              ? {
                  type: 'preselected',
                  provider_id: config.PROVIDER_ID_PRESELECTED,
                  scheme_id: 'sepa_credit_transfer'
                }
              : {
                  type: 'user_selected',
                  filter
                },
            beneficiary: {
              type: 'external_account',
              reference: 'reference',
              account_holder_name: config.BENEFICIARY_NAME,
              account_identifier: {
                type: AccountIdentifierType.Iban,
                iban: config.BENEFICIARY_IBAN
              }
            }
          }
        }
      : {
          ...this.basePayment,
          currency: 'GBP',
          payment_method: {
            type: 'bank_transfer',
            provider_selection: {
              type: 'user_selected',
              filter
            },
            beneficiary: {
              type: 'external_account',
              reference: 'reference',
              account_holder_name: config.BENEFICIARY_NAME,
              account_identifier: {
                type: AccountIdentifierType.SortCodeAccountNumber,
                account_number: config.ACCOUNT_NUMBER,
                sort_code: config.SORT_CODE
              }
            }
          }
        };
  }

  // ob-lloyds works
  // mock-payments-gb-redirect
  // ob-monzo does not work with preselected
  private buildPaymentRequestWithProvider(): CreatePaymentRequest {
    return {
      ...this.basePayment,
      currency: 'GBP',
      payment_method: {
        type: 'bank_transfer',
        provider_selection: {
          type: 'preselected',
          provider_id: config.PROVIDER_ID_PRESELECTED,
          scheme_id: 'faster_payments_service'
        },
        beneficiary: {
          type: 'external_account',
          reference: 'reference',
          account_holder_name: config.BENEFICIARY_NAME,
          account_identifier: {
            type: AccountIdentifierType.SortCodeAccountNumber,
            account_number: config.ACCOUNT_NUMBER,
            sort_code: config.SORT_CODE
          }
        }
      }
    };
  }
}
