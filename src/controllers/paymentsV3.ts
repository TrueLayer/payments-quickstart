import { NextFunction, Request, Response } from 'express';

import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/paymentv3-client';
import { HttpException } from 'middleware/errors';
import config from 'config';
import { ProviderSelectionFilter } from 'models/v3/payments-api/common';
import {
  CreatePaymentRequest,
  ProviderSelection,
  SchemeSelection
} from 'models/v3/payments-api/create_payment';

/**
 * Controller for the PaymentsV3 API - Payments.
 * It responds to two endpoints, one to create a payment and one to retrieve a payment.
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
   * Body: buildPaymentRequest()
   *
   * Response: a payment, following the [response specification](https://docs.truelayer.com/reference/create-payment)
   */
  private makePayment = (currency?: 'EUR') => {
    const request = this.buildPaymentRequest(currency);
    return this.doPayment(request);
  };

  private doPayment = (request: CreatePaymentRequest) => async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.paymentClient.initiatePayment(request);

      res.status(200).send({
        localhost: `http://localhost:3000/payments#payment_id=${response.id}&resource_token=${response.resource_token}&return_uri=${config.REDIRECT_URI}`,
        hpp_url: `${config.HPP_URI}/payments#payment_id=${response.id}&resource_token=${response.resource_token}&return_uri=${config.REDIRECT_URI}`,
        ...response
      });
    } catch (error) {
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
   * It creates a new payment with a user selected scheme and provider.
   *
   * Method: POST
   * Path: /v3/payment/scheme_selection
   * Header: Authorization: Bearer {auth_token}
   * Body: buildPaymentRequestWithUserSelectedScheme()
   *
   * */
  createPaymentWithUserSelectedScheme = () => {
    const request = this.buildPaymentRequestWithUserSelectedScheme();
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

      const response = await this.paymentClient.getPayment(id);
      res.status(200).send(response);
    } catch (error) {
      next(error instanceof HttpException ? error : new HttpException(500, 'Failed to retrieve the payment.'));
    }
  };

  private buildPaymentRequest(currency?: 'EUR'): CreatePaymentRequest {
    // Include all providers by default,
    // this is particulary useful when testing against embedded flow mock banks on Mobile (xs2a-volksbanken-de-sandbox)
    const filter: ProviderSelectionFilter = {
      release_channel: 'alpha'
    };

    const beneficiary = this.getBeneficiary(currency);

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
            beneficiary
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
            beneficiary
          }
        };
  }

  // ob-lloyds works
  // mock-payments-gb-redirect
  // ob-monzo does not work with preselected
  private buildPaymentRequestWithUserSelectedScheme(): CreatePaymentRequest {
    const beneficiary = this.getBeneficiary('EUR');
    const filter: ProviderFilter = {
      release_channel: 'alpha'
    };

    let providerSelection: ProviderSelection;

    const schemeSelection: SchemeSelection = {
      type: 'user_selected'
    };

    if (config.PROVIDER_ID_PRESELECTED) {
      providerSelection = {
        type: 'preselected',
        provider_id: config.PROVIDER_ID_PRESELECTED,
        scheme_selection: schemeSelection
      };
    } else {
      providerSelection = {
        type: 'user_selected',
        filter,
        scheme_selection: schemeSelection
      };
    }

    return {
      ...this.basePayment,
      currency: 'EUR',
      payment_method: {
        type: 'bank_transfer',
        provider_selection: providerSelection,
        beneficiary
      }
    };
  }

  // ob-lloyds works
  // mock-payments-gb-redirect
  // ob-monzo does not work with preselected
  private buildPaymentRequestWithProvider(): CreatePaymentRequest {
    const beneficiary = this.getBeneficiary();

    return {
      ...this.basePayment,
      currency: 'GBP',
      payment_method: {
        type: 'bank_transfer',
        provider_selection: {
          type: 'preselected',
          provider_id: config.PROVIDER_ID_PRESELECTED!,
          scheme_id: 'faster_payments_service'
        },
        beneficiary
      }
    };
  }

  private getBeneficiary(currency?: 'EUR'): CreatePaymentRequest['payment_method']['beneficiary'] {
    if (currency === 'EUR') {
      if (!config.BENEFICIARY_IBAN) {
        throw new Error('Missing BENEFICIARY_IBAN');
      }

      return {
        type: 'external_account',
        reference: 'reference',
        account_holder_name: config.BENEFICIARY_NAME,
        account_identifier: {
          type: 'iban',
          iban: config.BENEFICIARY_IBAN
        }
      };
    } else {
      if (!config.ACCOUNT_NUMBER) {
        throw new Error('Missing ACCOUNT_NUMBER');
      }

      if (!config.SORT_CODE) {
        throw new Error('Missing SORT_CODE');
      }

      return {
        type: 'external_account',
        reference: 'reference',
        account_holder_name: config.BENEFICIARY_NAME,
        account_identifier: {
          type: 'sort_code_account_number',
          account_number: config.ACCOUNT_NUMBER,
          sort_code: config.SORT_CODE
        }
      };
    }
  }
}
