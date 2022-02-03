import { NextFunction, Request, Response } from 'express';

import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/paymentv3-client';
import { HttpException } from 'middleware/errors';
import config from 'config';
import { CreatePaymentRequest } from 'models/v3/payments-api/create_payment';

/**
 * Controller for the PaymentsV3 API.
 * It responds to two endpoints, one to create a payment and one to retrieve the status of a payment.
 */
export default class PaymentsV3Controller {
  private paymentClient = new PaymentsClient(new AuthenticationClient());

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
   * Response: a payment, following the [response specification](https://pay-api-specs.t7r.dev/#operation/create-payment)
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
  createPayment = async (_req: Request, res: Response, next: NextFunction) => {
    const request = this.buildPaymentRequest();

    try {
      // Ideally we should use DTOs / Domain Types but givent that the API spec is still work in progress, we keep the type transparent
      const response = await this.paymentClient.initiatePayment(request);
      res.status(200).send({
        hpp_url: `https://payment.t7r.dev/payments#payment_id=${response.id}&resource_token=${response.resource_token}&return_uri=${config.REDIRECT_URI}`,
        ...response
      });
    } catch (error) {
      console.log('Failed to initiate payment.', error);
      next(error instanceof HttpException ? error : new HttpException(500, 'Failed to initiate payment.'));
    }
  };

  /**
   * It returns the status of a payment, given its id.
   *
   * Method: GET
   * Path: /v3/payment/{payment_id}
   * Header: Authorization: Bearer {payment_resource_token}
   * Response: A payment status object, following [the specification](https://pay-api-specs.t7r.dev/#operation/get-payment)
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
      console.log('Failed to initiate payment.', error);
      next(error instanceof HttpException ? error : new HttpException(500, 'Failed to retrieve the payment.'));
    }
  };

  private buildPaymentRequest(): CreatePaymentRequest {
    return {
      amount_in_minor: 1,
      currency: 'GBP',
      payment_method: {
        type: 'bank_transfer',
        provider_selection: {
          type: 'user_selected',
          filter: null
        },
        beneficiary: {
          type: 'external_account',
          account_holder_name: config.BENEFICIARY_NAME,
          reference: 'Test Ref',
          account_identifier: {
            type: 'sort_code_account_number',
            account_number: config.ACCOUNT_NUMBER,
            sort_code: config.SORT_CODE
          }
        }
      },
      user: {
        name: 'John Doe',
        phone: '+447514983456',
        email: 'johndoe@gmail.com'
      }
    };
  }
}
