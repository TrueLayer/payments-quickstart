import { NextFunction, Request, Response } from 'express';
import {
  Beneficiary,
  CreatePaymentRequest,
  CreatePaymentRequestResponse,
  ProviderSelection,
  SchemaSelection
} from 'models/v3/payments-api/create_payment';
import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/paymentv3-client';
import config from 'config';
import { HttpException } from 'middleware/errors';
import { PaymentAccountIdentifier } from 'models/v3/payments-api/common';

export class PaymentsController {
  private paymentClient = new PaymentsClient(new AuthenticationClient());

  createPayment = async (req: Request<Partial<CreatePaymentRequest>>, res: Response, next: NextFunction) => {
    const request = this.buildDefaultCreatePaymentRequest(req.body);
    try {
      const response = await this.paymentClient.initiatePayment(request);
      res.status(200).send({
        localhost: this.buildHppUrl(response, 'http://localhost:3000'),
        hpp_url: this.buildHppUrl(response),
        request,
        response
      });
    } catch (error) {
      next(error instanceof HttpException ? error : new HttpException(500, 'Failed to initiate payment.'));
    }
  };

  private buildDefaultCreatePaymentRequest = (req: Partial<CreatePaymentRequest>): any => {
    if (req?.payment_method != undefined && req?.payment_method?.type != 'bank_transfer') {
      throw new Error('Unsuporrted payment method type. Only "bank_transfer" is supported.');
    }

    return {
      amount_in_minor: 1,
      currency: req?.currency ?? 'GBP',
      user: {
        name: 'John Doe',
        phone: '+447514983456',
        email: 'johndoe@gmail.com',
        ...req?.user
      },
      payment_method: {
        type: 'bank_transfer', // Always bank transfer
        provider_selection: this.overrideProviderSelection(req?.payment_method?.provider_selection),
        beneficiary: { ...this.overrideBeneficiary(req?.payment_method?.beneficiary) }
      }
    };
  };

  private buildHppUrl = (response: CreatePaymentRequestResponse, baseUrl?: string): string => {
    return `${baseUrl ?? config.HPP_URI}/payments#payment_id=${response.id}&resource_token=${
      response.resource_token
    }&return_uri=${config.REDIRECT_URI}`;
  };

  private overrideProviderSelection = (providerSelection?: Partial<ProviderSelection>): ProviderSelection => {
    if (providerSelection != undefined) {
      if (providerSelection?.type == null) {
        throw new Error('provider selection type is required');
      }

      if (providerSelection.type === 'user_selected') {
        return {
          type: 'user_selected',
          filter: {
            release_channel: 'alpha',
            ...providerSelection?.filter
          },
          ...this.overrideSchemeSelection(providerSelection?.scheme_selection)
        };
      }

      if (providerSelection.type === 'preselected') {
        const result: ProviderSelection = {
          type: 'preselected',
          provider_id: providerSelection?.provider_id ?? 'ob-lloyds',
          ...this.overrideSchemeSelection(providerSelection?.scheme_selection)
        };

        if (providerSelection?.scheme_selection == undefined) {
          result.scheme_id = providerSelection?.scheme_id ?? 'faster_payments_service';
        }

        return result;
      }
    }

    return {
      type: 'user_selected',
      filter: {
        release_channel: 'alpha'
      }
    };
  };

  private overrideSchemeSelection = (
    schemeSelection?: Partial<SchemaSelection>
  ): { scheme_selection?: SchemaSelection } => {
    if (schemeSelection?.type == 'instant_only') {
      return {
        scheme_selection: {
          ...schemeSelection,
          type: 'instant_only'
        }
      };
    }

    if (schemeSelection?.type == 'instant_preferred') {
      return {
        scheme_selection: {
          ...schemeSelection,
          type: 'instant_preferred'
        }
      };
    }

    if (schemeSelection?.type == 'user_selected') {
      return {
        scheme_selection: {
          type: 'user_selected'
        }
      };
    }

    return {};
  };

  private overrideBeneficiary = (beneficiary?: Partial<Beneficiary>): Beneficiary => {
    if (beneficiary != undefined) {
      if (beneficiary?.type == null) {
        throw new Error('beneficiary type is required');
      }

      if (beneficiary.type === 'external_account') {
        return {
          type: 'external_account',
          reference: beneficiary?.reference ?? 'some reference',
          account_holder_name: beneficiary?.account_holder_name ?? 'Merry Poppins',
          account_identifier: { ...this.overrideAccountIdentifier(beneficiary?.account_identifier) }
        };
      }
      // Add merchant_account if needed
    }

    // Default to external_account
    return {
      type: 'external_account',
      reference: 'some reference',
      account_holder_name: 'Merry Poppins',
      account_identifier: {
        type: 'sort_code_account_number',
        account_number: '12345678',
        sort_code: '112233'
      }
    };
  };

  private overrideAccountIdentifier = (
    accountIdentifier?: Partial<PaymentAccountIdentifier>
  ): PaymentAccountIdentifier => {
    if (accountIdentifier != undefined) {
      if (accountIdentifier.type == null) {
        throw new Error('account identifier type is required');
      }

      if (accountIdentifier.type === 'sort_code_account_number') {
        return {
          type: 'sort_code_account_number',
          account_number: accountIdentifier?.account_number ?? '12345678',
          sort_code: accountIdentifier?.sort_code ?? '112233'
        };
      }

      if (accountIdentifier.type === 'iban') {
        return {
          type: 'iban',
          iban: accountIdentifier?.iban ?? 'GB33BUKB20201555555555'
        };
      }
    }

    return {
      type: 'sort_code_account_number',
      account_number: '12345678',
      sort_code: '112233'
    };
  };
}
