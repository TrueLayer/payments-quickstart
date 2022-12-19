import { NextFunction, Request, Response } from 'express';
import config from 'config';
import { HttpException } from 'middleware/errors';
import AuthenticationClient from 'clients/authentication-client';
import MandatesClient from 'clients/mandatev3-client';
import { CreateMandateRequest, createMandateRequestSchema } from 'models/v3/payments-api/create_mandates';
import { CurrencyCode, PeriodAlignment } from '../models/v3/payments-api/mandate_common';

export default class MandatesV3Controller {
  private mandatesClient = new MandatesClient(new AuthenticationClient());

  createMandate = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body || {};
    const baseBody = { ...this.generateMandate(), ...body };
    try {
      const validate = createMandateRequestSchema.safeParse(baseBody);
      if (!validate.success) {
        throw new HttpException(400, `Invalid request: ${validate.error}`);
      }

      const response = await this.mandatesClient.initiateMandate(baseBody);

      res.status(200).send({
        localhost: `http://localhost:3000/mandates#mandate_id=${response.id}&resource_token=${response.resource_token}&return_uri=${config.REDIRECT_URI}`,
        hpp_url: `${config.HPP_URI}/mandates#mandate_id=${response.id}&resource_token=${response.resource_token}&return_uri=${config.REDIRECT_URI}`,
        ...response
      });
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, 'Failed to initiate mandate.'));
    }
  };

  getMandate = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new HttpException(400, 'Expected `id` parameter.'));
    }

    try {
      const response = await this.mandatesClient.getMandate(id);
      res.status(200).send(response);
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, `Failed to retrieve mandate: ${id}.`));
    }
  };

  generateMandate(): CreateMandateRequest {
    const beneficiary = this.getBeneficiary();
    return {
      metadata: {},
      constraints: {
        maximum_individual_amount: 1,
        periodic_limits: {
          month: {
            maximum_amount: 1,
            period_alignment: PeriodAlignment.Calendar
          }
        }
      },
      currency: CurrencyCode.GBP,
      user: {
        name: 'John Doe',
        email: 'jhondoe@tester.com'
      },
      mandate: {
        type: 'sweeping',
        provider_selection: config.PROVIDER_ID_PRESELECTED
          ? {
              type: 'preselected',
              provider_id: config.PROVIDER_ID_PRESELECTED
            }
          : {
              type: 'user_selected'
            },
        beneficiary
      }
    };
  }

  private getBeneficiary(): CreateMandateRequest['mandate']['beneficiary'] {
    if (!config.BENEFICIARY_NAME) {
      throw new Error('Missing BENEFICIARY_NAME');
    }

    if (!config.ACCOUNT_NUMBER) {
      throw new Error('Missing ACCOUNT_NUMBER');
    }

    if (!config.SORT_CODE) {
      throw new Error('Missing SORT_CODE');
    }

    return {
      type: 'external_account',
      account_holder_name: config.BENEFICIARY_NAME,
      account_identifier: {
        type: 'sort_code_account_number',
        account_number: config.ACCOUNT_NUMBER,
        sort_code: config.SORT_CODE
      }
    };
  }
}
